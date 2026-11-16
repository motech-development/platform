# Node logger architecture

## Purpose

A shared [winston](https://github.com/winstonjs/winston) logger for Lambda handlers. Lambda captures `console.*` output, so the console transport is overridden to write through `console.log` / `console.error` rather than winston's default stream writes. Consumers include `@accounts/api`, `@accounts/data`, `@accounts/data-restore`, `@accounts/reports` and `@core/anti-virus`. See the [repository architecture](../../../docs/architecture.md).

## Layout

| Path             | Contents                                                          |
| ---------------- | ----------------------------------------------------------------- |
| `src/logger.ts`  | Entry point; creates and default-exports the logger               |
| `src/opts.ts`    | Console transport options (level and custom `log` implementation) |
| `src/__tests__/` | Vitest tests for both files                                       |
| `vite.config.ts` | Library build to `lib/index.esm.js` and `lib/index.cjs.js`        |

## API reference

### `default` — `winston.Logger`

Created with `winston.createLogger({ transports: [new winston.transports.Console(opts)] })`. All standard winston methods apply (`info`, `warn`, `error`, `debug`, …). No format is configured, so winston's default JSON format applies.

```ts
import logger from '@motech-development/node-logger';

logger.error('Report failed', error);
```

### Transport options (`src/opts.ts`, internal)

| Option  | Behaviour                                                                                                                                                                                            |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `level` | `process.env.LOG_LEVEL`, defaulting to `info`. Read once at module load.                                                                                                                             |
| `log`   | Emits `logged` on the next tick, then writes `info[Symbol.for('message')]` with `console.error` if the level is in the transport's `stderrLevels`, otherwise `console.log`; then calls the callback. |

`LEVEL` and `MESSAGE` (`Symbol.for('level')` / `Symbol.for('message')`) are also exported from `opts.ts` but not from the package entry.

## Design notes

- `console.*` rather than `process.stdout` so the Lambda runtime attaches request IDs and log levels.
- `LOG_LEVEL` is read at import time; set it in the function environment, not at runtime.

## Testing

Vitest, tests in `src/__tests__/`. Run one file:

```bash
yarn workspace @motech-development/node-logger vitest run src/__tests__/opts.test.ts
```

## Releasing

Released by multi-semantic-release from Conventional Commits on `main`, using the `package` config from [`@motech-development/semantic-release`](../../semantic-release/README.md) (see `.releaserc.json`).
