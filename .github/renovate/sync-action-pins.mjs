import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const scriptPath = fileURLToPath(import.meta.url);
const repositoryRoot = resolve(dirname(scriptPath), '../..');
const actionReference =
  /(?<prefix>uses:\s+)(?<pin>[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?@[a-f0-9]{40}\s+# v\d+\.\d+\.\d+)/g;

function actionPin(line) {
  return new RegExp(actionReference.source).exec(line)?.groups.pin;
}

export function updatedActionPins(diff) {
  const updates = new Map();
  const hunks = diff.split(/^@@[^\n]*@@[^\n]*$/m).slice(1);

  for (const hunk of hunks) {
    const lines = hunk.split('\n');
    const previous = lines
      .filter((line) => line.startsWith('-') && !line.startsWith('---'))
      .map(actionPin)
      .filter(Boolean);
    const next = lines
      .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
      .map(actionPin)
      .filter(Boolean);

    if (previous.length !== next.length) {
      throw new Error('cannot pair changed GitHub Action references');
    }

    previous.forEach((pin, index) => updates.set(pin, next[index]));
  }

  return updates;
}

export function synchronizeActionPins(content, pins) {
  return content.replace(
    actionReference,
    (reference, _prefix, _pin, _offset, _content, groups) => {
      const updated = pins.get(groups.pin);
      return updated ? `${groups.prefix}${updated}` : reference;
    },
  );
}

async function main() {
  const [{ stdout: diff }, { stdout: trackedFiles }] = await Promise.all([
    execFileAsync('git', ['diff', 'HEAD', '--unified=0', '--', '.github'], {
      cwd: repositoryRoot,
    }),
    execFileAsync('git', ['ls-files', '.github'], {
      cwd: repositoryRoot,
    }),
  ]);
  const pins = updatedActionPins(diff);

  if (pins.size === 0) {
    throw new Error('no updated GitHub Action pins found');
  }

  await Promise.all(
    trackedFiles
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(async (relativePath) => {
        const path = resolve(repositoryRoot, relativePath);
        const content = await readFile(path, 'utf8');
        const synchronized = synchronizeActionPins(content, pins);

        if (synchronized !== content) {
          await writeFile(path, synchronized);
        }
      }),
  );

  await execFileAsync('node', ['.github/delivery/generate.mjs'], {
    cwd: repositoryRoot,
  });
}

if (process.argv[1] === scriptPath) {
  await main();
}
