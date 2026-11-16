# Webpack permissions plugin architecture

## Purpose

Makes bundled files executable (or any other mode) after a build, for example binaries packaged into a Lambda. Used by `@core/anti-virus`. See the [repository architecture](../../../docs/architecture.md).

## API reference

### `default` — `class WebpackPermissionsPlugin`

```ts
new WebpackPermissionsPlugin({
  file: string; // mode passed to fs.chmodSync, e.g. '755'
  folders(compiler: Compiler): string[];
})
```

`apply(compiler)` taps `compiler.hooks.done`. When the build finishes it calls `folders(compiler)` and, for each folder:

- throws `<path> does not exist` if the folder is missing (fails the build);
- finds files at depth 0 only (via `filehound`; subfolders are not recursed) and runs `chmodSync(file, options.file)` on each.

Peer dependency: `webpack` ^5.

## Testing

Source in `src/webpack-permissions-plugin.ts`, tests in `src/__tests__/`. Run one file:

```bash
yarn workspace @motech-development/webpack-permissions-plugin vitest run src/__tests__/webpack-permissions-plugin.ts
```

## Releasing

Released by multi-semantic-release from Conventional Commits on `main`, using the `package` config from [`@motech-development/semantic-release`](../../semantic-release/README.md) (see `.releaserc.json`).
