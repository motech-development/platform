import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(scriptDirectory, '..');
const repositoryRoot = resolve(packageRoot, '../..');
const storybookBinary = resolve(
  repositoryRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'storybook.cmd' : 'storybook',
);
const storybookHome =
  process.env.STORYBOOK_HOME ?? join(tmpdir(), 'breeze-ui-storybook-home');
const storybookOutputDirectory =
  process.env.STORYBOOK_OUTPUT_DIR ??
  join(tmpdir(), 'breeze-ui-storybook-static');

const options = process.argv.slice(2).reduce(
  (parsedOptions, argument, index, allArguments) => {
    if (argument === '--host') {
      return {
        ...parsedOptions,
        host: allArguments[index + 1] ?? parsedOptions.host,
      };
    }

    if (argument === '--port') {
      return {
        ...parsedOptions,
        port: Number(allArguments[index + 1] ?? parsedOptions.port),
      };
    }

    return parsedOptions;
  },
  {
    host: '127.0.0.1',
    port: 6006,
  },
);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const buildStorybook = () => {
  const result = spawnSync(
    storybookBinary,
    ['build', '--test', '--output-dir', storybookOutputDirectory],
    {
      cwd: packageRoot,
      env: {
        ...process.env,
        HOME: storybookHome,
        STORYBOOK_DISABLE_TELEMETRY: '1',
      },
      stdio: 'inherit',
    },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const getRequestedFile = (requestUrl = '/') => {
  const { pathname } = new URL(requestUrl, `http://${options.host}`);
  const pathnameWithoutLeadingSlash = decodeURIComponent(pathname).replace(
    /^\/+/,
    '',
  );
  const requestedFile = pathnameWithoutLeadingSlash || 'index.html';
  const resolvedFile = resolve(storybookOutputDirectory, requestedFile);

  if (!resolvedFile.startsWith(resolve(storybookOutputDirectory))) {
    return undefined;
  }

  if (existsSync(resolvedFile) && statSync(resolvedFile).isFile()) {
    return resolvedFile;
  }

  const fallbackFile = resolve(storybookOutputDirectory, 'index.html');

  return existsSync(fallbackFile) ? fallbackFile : undefined;
};

buildStorybook();

createServer((request, response) => {
  const requestedFile = getRequestedFile(request.url);

  if (!requestedFile) {
    response.writeHead(404);
    response.end();

    return;
  }

  response.writeHead(200, {
    'Content-Type':
      contentTypes[extname(requestedFile)] ?? 'application/octet-stream',
  });
  createReadStream(requestedFile).pipe(response);
}).listen(options.port, options.host, () => {
  console.log(
    `Serving Breeze UI Storybook from ${storybookOutputDirectory} at http://${options.host}:${options.port}`,
  );
});
