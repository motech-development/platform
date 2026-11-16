# ID emails

> Auth0 email templates

Pug sources for the transactional emails the Auth0 tenant sends. [`@id/tenant`](../tenant/) uploads the built HTML when it deploys. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

From the repository root:

```sh
nvm use
yarn install
yarn workspace @id/emails build
```

Open the files in `build/` in a browser to preview them.

## Scripts

| Script                                 | Purpose                             |
| -------------------------------------- | ----------------------------------- |
| `yarn workspace @id/emails build`      | Compiles `src/*.pug` into `build/`. |
| `yarn workspace @id/emails formatting` | Prettier check.                     |
