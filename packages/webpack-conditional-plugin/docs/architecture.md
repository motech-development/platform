# Webpack conditional plugin architecture

## Purpose

Lets a webpack config include a plugin only when a predicate on the compiler is true, without branching the config. Used by `@core/anti-virus`. See the [repository architecture](../../../docs/architecture.md).

## API reference

### `default` — `class WebpackConditionalPlugin`

```ts
new WebpackConditionalPlugin(
  condition: (compiler: Compiler) => boolean,
  plugin: WebpackPluginInstance,
)
```

`apply(compiler)` calls `condition(compiler)` once, when webpack applies plugins; if it returns `true`, calls `plugin.apply(compiler)`. Otherwise it does nothing. Errors thrown by either propagate to webpack.

Peer dependency: `webpack` ^5.

## Testing

Source in `src/webpack-conditional-plugin.ts`, tests in `src/__tests__/`. Run one file:

```bash
yarn workspace @motech-development/webpack-conditional-plugin vitest run src/__tests__/webpack-conditional-plugin.ts
```

## Releasing

Released by multi-semantic-release from Conventional Commits on `main`, using the `package` config from [`@motech-development/semantic-release`](../../semantic-release/README.md) (see `.releaserc.json`).
