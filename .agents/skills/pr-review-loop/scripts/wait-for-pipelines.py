#!/usr/bin/env python3
"""Wait for observed PR checks using workflow history; never invoke a model."""

import argparse
from collections import defaultdict
from datetime import datetime
import json
import os
from pathlib import Path
import re
import statistics
import subprocess
import tempfile
import time


def timestamp(value):
  if not value:
    return None
  try:
    return datetime.fromisoformat(value.replace('Z', '+00:00')).timestamp()
  except (ValueError, AttributeError):
    return None


def gh_json(args, allowed_codes=(0,)):
  result = subprocess.run(
    ['gh', *args], capture_output=True, text=True, timeout=60, check=False
  )
  if result.returncode not in allowed_codes:
    raise RuntimeError(f'GitHub command failed (exit {result.returncode}).')
  try:
    return json.loads(result.stdout)
  except json.JSONDecodeError as error:
    raise RuntimeError('GitHub returned no usable JSON result.') from error


def workflow_averages(runs):
  groups = defaultdict(list)
  for run in sorted(runs, key=lambda item: item.get('createdAt') or '', reverse=True):
    if run.get('conclusion') != 'success':
      continue
    key = (run.get('workflowName') or '', run.get('event') or '')
    start, end = timestamp(run.get('createdAt')), timestamp(run.get('updatedAt'))
    if key[0] and start is not None and end is not None and end > start:
      if len(groups[key]) < 10:
        groups[key].append(end - start)
  return {
    key: {'mean_seconds': statistics.mean(values), 'samples': len(values)}
    for key, values in groups.items()
  }


def next_delay(checks, averages, now, overrun):
  estimates = []
  for check in checks:
    if check.get('bucket') != 'pending':
      continue
    key = (check.get('workflow') or '', check.get('event') or '')
    timing = averages.get(key)
    created = timestamp(check.get('workflowCreatedAt'))
    if timing and created is not None:
      remaining = timing['mean_seconds'] * 1.2 - max(0, now - created)
      if remaining > 0:
        estimates.append(remaining)
  if estimates:
    return max(60, min(900, max(estimates))), True
  return min(900, 120 * (2 ** min(overrun, 3))), False


def write_state(path, state):
  with tempfile.NamedTemporaryFile(
    mode='w', encoding='utf-8', dir=path.parent, delete=False
  ) as temporary:
    json.dump(state, temporary, indent=2)
    temporary.write('\n')
    temporary_path = temporary.name
  os.replace(temporary_path, path)


def observe(args, query=gh_json, sleep=time.sleep, now=time.time):
  started = now()
  averages = None
  run_created_at = {}
  overrun = 0
  state = {'repo': args.repo, 'pr': args.pr, 'head': args.head}

  def finish(reason, code):
    state.update(reason=reason, next_wake_at=None, observed_at=now())
    try:
      write_state(args.state_file, state)
    except OSError as error:
      state['state_file_error'] = type(error).__name__
    print(json.dumps(state), flush=True)
    return code

  print(json.dumps({'reason': 'started', **state, 'state_file': str(args.state_file)}), flush=True)
  try:
    while True:
      pr = query(['pr', 'view', str(args.pr), '--repo', args.repo, '--json', 'headRefOid,state'])
      if pr['headRefOid'] != args.head:
        return finish('head_changed', 4)
      if pr['state'] != 'OPEN':
        return finish('pr_closed', 5)
      checks = query([
        'pr', 'checks', str(args.pr), '--repo', args.repo, '--json',
        'name,bucket,state,workflow,event,startedAt,completedAt,link'
      ], allowed_codes=(0, 1, 8))
      # PR checks cannot be pinned to a SHA; validate their head before using them.
      latest = query(['pr', 'view', str(args.pr), '--repo', args.repo, '--json', 'headRefOid,state'])
      if latest['headRefOid'] != args.head:
        return finish('head_changed', 4)
      if latest['state'] != 'OPEN':
        return finish('pr_closed', 5)
      if not isinstance(checks, list):
        raise RuntimeError('GitHub returned an invalid check list.')
      state['checks'] = checks
      if any(check.get('bucket') in ('fail', 'cancel') for check in checks):
        return finish('check_failed', 2)
      if any(check.get('bucket') not in ('pass', 'skipping', 'pending') for check in checks):
        return finish('unknown_check_state', 6)
      if checks and all(check['bucket'] in ('pass', 'skipping') for check in checks):
        return finish('observed_checks_settled', 0)
      if now() - started >= args.max_wait_seconds:
        return finish('inspection_needed', 3)
      if averages is None:
        runs = query([
          'run', 'list', '--repo', args.repo, '--status', 'success', '--limit', '100',
          '--json', 'workflowName,event,conclusion,createdAt,updatedAt'
        ])
        averages = workflow_averages(runs)
      for check in checks:
        if check.get('bucket') != 'pending' or not check.get('workflow'):
          continue
        match = re.search(r'/actions/runs/(\d+)(?:/|$)', check.get('link') or '')
        if match:
          run_id = match.group(1)
          if run_id not in run_created_at:
            run = query(['run', 'view', run_id, '--repo', args.repo, '--json', 'createdAt'])
            run_created_at[run_id] = run.get('createdAt')
          check['workflowCreatedAt'] = run_created_at[run_id]
      state['workflow_timings'] = [
        {'workflow': workflow, 'event': event, **timing}
        for (workflow, event), timing in averages.items()
        if any(check.get('workflow') == workflow for check in checks)
      ]
      planned_delay, estimated = next_delay(checks, averages, now(), overrun)
      delay = min(
        planned_delay,
        max(0, args.max_wait_seconds - (now() - started))
      )
      state.update(reason='waiting', observed_at=now(), next_wake_at=now() + delay)
      write_state(args.state_file, state)
      sleep(delay)
      overrun = 0 if estimated else overrun + 1
  except KeyboardInterrupt:
    return finish('cancelled', 130)
  except (RuntimeError, OSError, KeyError, TypeError, subprocess.TimeoutExpired) as error:
    state['error'] = str(error) if isinstance(error, RuntimeError) else type(error).__name__
    return finish('observation_error', 6)


def main():
  parser = argparse.ArgumentParser(description=__doc__)
  parser.add_argument('--repo', required=True, help='[HOST/]OWNER/REPO')
  parser.add_argument('--pr', required=True, type=int)
  parser.add_argument('--head', required=True, help='Expected full PR head SHA')
  parser.add_argument('--state-file', required=True, type=Path)
  parser.add_argument('--max-wait-seconds', type=int, default=3600)
  args = parser.parse_args()
  if args.pr <= 0 or args.max_wait_seconds <= 0:
    parser.error('PR number and observation window must be positive.')
  return observe(args)


if __name__ == '__main__':
  raise SystemExit(main())
