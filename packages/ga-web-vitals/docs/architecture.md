# Google Analytics Web Vitals architecture

## Purpose

A single reporter callback that forwards [Web Vitals](https://github.com/GoogleChrome/web-vitals) metrics to Universal Analytics (`analytics.js`). Used by `@accounts/client` and `@id/client`. See the [repository architecture](../../../docs/architecture.md).

## Layout

| Path                             | Contents       |
| -------------------------------- | -------------- |
| `src/ga-web-vitals.ts`           | The reporter   |
| `src/__tests__/ga-web-vitals.ts` | Its test suite |

## API reference

### `reporter(metric)` (default export)

```ts
interface IReporter { id: string; name: string; value: number }
reporter(metric: IReporter): void
```

Calls the global `ga('send', 'event', fields)` with:

| Field            | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| `eventCategory`  | `'Web Vitals'`                                             |
| `eventAction`    | `metric.name`                                              |
| `eventLabel`     | `metric.id`                                                |
| `eventValue`     | `Math.round(value)`, or `Math.round(value * 1000)` for CLS |
| `nonInteraction` | `true`                                                     |

The global `ga` must exist; if the `analytics.js` snippet is not loaded the call throws a `ReferenceError`. Types for `ga` come from `@types/google.analytics` (a dev dependency).

## Design notes

CLS is a unitless fraction, so it is scaled by 1000 before rounding to keep it meaningful as an integer event value.

## Testing

Vitest in a Node environment; each test assigns a `vi.fn()` to `global.ga` and asserts the call.

Run one file: `yarn workspace @motech-development/ga-web-vitals vitest run src/__tests__/ga-web-vitals.ts`.

## Releasing

`.releaserc.json` extends `@motech-development/semantic-release/package`. The root `yarn release` runs multi-semantic-release, which versions this package from Conventional Commits that touch it on `main` (or `next`) and publishes it to npm. `package.json` keeps the placeholder version `0.0.0-development`; do not bump it by hand.
