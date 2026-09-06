import argparse
from contextlib import redirect_stdout
from datetime import datetime, timezone
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest


spec = importlib.util.spec_from_file_location(
  'pipeline_wait', Path(__file__).with_name('wait-for-pipelines.py')
)
pipeline_wait = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline_wait)


def iso(seconds):
  return datetime.fromtimestamp(seconds, timezone.utc).isoformat()


def check(bucket='pending', workflow='QA', started=1000):
  return {
    'name': 'Tests', 'bucket': bucket, 'workflow': workflow,
    'event': 'pull_request', 'startedAt': iso(started)
  }


def run(duration, created=100):
  return {
    'workflowName': 'QA', 'event': 'pull_request', 'conclusion': 'success',
    'createdAt': iso(created), 'updatedAt': iso(created + duration)
  }


class PipelineWaitTests(unittest.TestCase):
  def observe(self, replies, max_wait=3600, cancel=False):
    calls, sleeps, clock = [], [], [1100.0]
    remaining = iter(replies)

    def query(args, **kwargs):
      calls.append((args, kwargs))
      reply = next(remaining)
      if isinstance(reply, Exception):
        raise reply
      return reply

    def sleep(seconds):
      if cancel:
        raise KeyboardInterrupt()
      sleeps.append(seconds)
      clock[0] += seconds

    with tempfile.TemporaryDirectory() as directory:
      path = Path(directory) / 'wait.json'
      args = argparse.Namespace(
        repo='owner/repo', pr=1, head='head-a', state_file=path,
        max_wait_seconds=max_wait
      )
      output = io.StringIO()
      with redirect_stdout(output):
        code = pipeline_wait.observe(args, query=query, sleep=sleep, now=lambda: clock[0])
      state = json.loads(path.read_text())
    return code, state, sleeps, calls, output.getvalue().splitlines()

  def test_average_uses_ten_recent_successes_and_keeps_events_separate(self):
    runs = [run(300, created=index * 100) for index in range(1, 11)]
    runs += [run(9000, created=0), {**run(8000), 'conclusion': 'failure'}]
    runs += [{**run(1200), 'event': 'push'}]
    averages = pipeline_wait.workflow_averages(runs)
    self.assertEqual(averages[('QA', 'pull_request')], {'mean_seconds': 300, 'samples': 10})
    self.assertEqual(averages[('QA', 'push')]['mean_seconds'], 1200)

  def test_concurrent_workflows_use_longest_remaining_estimate_not_sum(self):
    averages = {
      ('QA', 'pull_request'): {'mean_seconds': 600},
      ('Preview', 'pull_request'): {'mean_seconds': 300}
    }
    delay, estimated = pipeline_wait.next_delay(
      [check(), check(workflow='Preview')], averages, now=1100, overrun=0
    )
    self.assertEqual(delay, 620)
    self.assertTrue(estimated)

  def test_waits_without_intermediate_model_output_then_returns_settled(self):
    opened = {'headRefOid': 'head-a', 'state': 'OPEN'}
    code, state, sleeps, calls, output = self.observe([
      opened, [check()], [run(600)], opened, [check('pass')], opened
    ])
    self.assertEqual(code, 0)
    self.assertEqual(state['reason'], 'observed_checks_settled')
    self.assertEqual(sleeps, [620])
    self.assertEqual(len(output), 2)
    self.assertEqual(sum(args[:2] == ['run', 'list'] for args, _ in calls), 1)
    self.assertTrue(all(args[:2] in (['pr', 'view'], ['pr', 'checks'], ['run', 'list']) for args, _ in calls))

  def test_new_head_during_wait_stops_before_reading_its_checks(self):
    code, state, sleeps, calls, _ = self.observe([
      {'headRefOid': 'head-a', 'state': 'OPEN'}, [check()], [],
      {'headRefOid': 'head-b', 'state': 'OPEN'}
    ])
    self.assertEqual((code, state['reason']), (4, 'head_changed'))
    self.assertEqual(sleeps, [120])
    self.assertEqual(sum(args[:2] == ['pr', 'checks'] for args, _ in calls), 1)

  def test_head_change_during_final_read_is_not_settled(self):
    code, state, *_ = self.observe([
      {'headRefOid': 'head-a', 'state': 'OPEN'}, [check('pass')],
      {'headRefOid': 'head-b', 'state': 'OPEN'}
    ])
    self.assertEqual((code, state['reason']), (4, 'head_changed'))

  def test_failed_or_cancelled_check_returns_for_diagnosis(self):
    for bucket in ('fail', 'cancel'):
      with self.subTest(bucket=bucket):
        code, state, sleeps, *_ = self.observe([
          {'headRefOid': 'head-a', 'state': 'OPEN'}, [check(bucket)]
        ])
        self.assertEqual((code, state['reason']), (2, 'check_failed'))
        self.assertEqual(sleeps, [])

  def test_no_checks_is_not_a_success_and_backoff_respects_window(self):
    opened = {'headRefOid': 'head-a', 'state': 'OPEN'}
    code, state, sleeps, *_ = self.observe([
      opened, [], [], opened, [], opened, []
    ], max_wait=300)
    self.assertEqual((code, state['reason']), (3, 'inspection_needed'))
    self.assertEqual(sleeps, [120, 180])

  def test_unknown_timings_back_off_and_cap_sleep(self):
    for overrun, expected in enumerate((120, 240, 480, 900, 900)):
      self.assertEqual(
        pipeline_wait.next_delay([check()], {}, 1100, overrun), (expected, False)
      )

  def test_api_failure_cancellation_and_closed_pr_are_not_success(self):
    opened = {'headRefOid': 'head-a', 'state': 'OPEN'}
    code, state, *_ = self.observe([RuntimeError('Access denied')])
    self.assertEqual((code, state['reason']), (6, 'observation_error'))
    code, state, *_ = self.observe([opened, [check()], []], cancel=True)
    self.assertEqual((code, state['reason']), (130, 'cancelled'))
    code, state, *_ = self.observe([{'headRefOid': 'head-a', 'state': 'MERGED'}])
    self.assertEqual((code, state['reason']), (5, 'pr_closed'))


if __name__ == '__main__':
  unittest.main()
