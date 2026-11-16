[![Deploy to production](https://github.com/motech-development/platform/actions/workflows/deploy-to-production.yml/badge.svg)](https://github.com/motech-development/platform/actions/workflows/deploy-to-production.yml)
[![Deploy to develop](https://github.com/motech-development/platform/actions/workflows/deploy-to-develop.yml/badge.svg)](https://github.com/motech-development/platform/actions/workflows/deploy-to-develop.yml)
[![Production scheduled tests](https://github.com/motech-development/platform/actions/workflows/production-scheduled-tests.yml/badge.svg)](https://github.com/motech-development/platform/actions/workflows/production-scheduled-tests.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=motech-development_platform&metric=alert_status)](https://sonarcloud.io/dashboard?id=motech-development_platform)

# Platform

> Motech Development applications monorepo

## Getting started

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/motech-development/platform)

Read [Architecture](docs/architecture.md) for how the applications and packages fit together. Every workspace has a README with its own setup and scripts.

## Applications

A diverse set of applications built by Motech Development

Run a workspace script with `yarn workspace <name> <script>`. Most workspaces' `test` script runs in watch mode.

### Accounts

Book keeping application to keep on top of your finances

- `@accounts/api`: accounts API
- `@accounts/client`: legacy accounts client application
- `@accounts/data`: accounts data infrastructure
- `@accounts/data-restore`: accounts data restore tooling
- `@accounts/infrastructure`: accounts infrastructure
- `@accounts/notifications`: accounts notifications infrastructure
- `@accounts/queue`: accounts queues infrastructure
- `@accounts/reports`: accounts report generator service
- `@accounts/storage`: accounts file storage
- `@accounts/web`: accounts placeholder with retained Amplify hosting

Start the legacy client by running `yarn workspace @accounts/client start`\
Start the placeholder by running `yarn workspace @accounts/web start`

### Core

Shared Motech Development services

- `@core/anti-virus`: anti-virus service
- `@core/comms`: comms infrastructure
- `@core/infrastructure`: core infrastructure as code

### ID

Auth0 tenant

- `@id/client`: universal login client
- `@id/emails`: email templates
- `@id/infrastructure`: ID infrastructure as code
- `@id/tenant`: Auth0 tenant configuration

Start the login client by running `yarn workspace @id/client start`

## Packages

Reusable NPM packages used in our applications

### API Gateway handler

Utility to make working with API gateway lambda functions less of a pain

Build the package by running `yarn workspace @motech-development/api-gateway-handler build`\
Test the package by running `yarn workspace @motech-development/api-gateway-handler test`

### AppSync Apollo

React Apollo client configured for AppSync

Build the package by running `yarn workspace @motech-development/appsync-apollo build`\
Test the package by running `yarn workspace @motech-development/appsync-apollo test`

### Auth

An Auth0 helper library for React

Build the package by running `yarn workspace @motech-development/auth build`\
Test the package by running `yarn workspace @motech-development/auth test`

### Fetch-backed hooks

Fetch-backed hooks for React

Build the package by running `yarn workspace @motech-development/axios-hooks build`\
Test the package by running `yarn workspace @motech-development/axios-hooks test`

### Breeze UI

Motech Development UI component library

Start storybook by running `yarn workspace @motech-development/breeze-ui storybook`\
Build the package by running `yarn workspace @motech-development/breeze-ui build`\
Test the package by running `yarn workspace @motech-development/breeze-ui test`

### ESLint base config

Reusable ESLint config

### ESLint React config

Reusable ESLint config for React apps

### GA Web Vitals

Google Analytics Web Vitals reporter

Build the package by running `yarn workspace @motech-development/ga-web-vitals build`\
Test the package by running `yarn workspace @motech-development/ga-web-vitals test`

### Logger

Application logger

Build the package by running `yarn workspace @motech-development/node-logger build`\
Test the package by running `yarn workspace @motech-development/node-logger test`

### Prettier config

Reusable Prettier config

### Query string hook

A hook to access query strings

Build the package by running `yarn workspace @motech-development/query-string-hook build`\
Test the package by running `yarn workspace @motech-development/query-string-hook test`

### S3 file operations

A wrapper utility to manage file operations on AWS S3

Build the package by running `yarn workspace @motech-development/s3-file-operations build`\
Test the package by running `yarn workspace @motech-development/s3-file-operations test`

### Semantic Release config

Reusable Semantic Release config

Test the package by running `yarn workspace @motech-development/semantic-release test`

### Serverless outputs env

Serverless plugin to take AWS outputs and write them into `.env` files

Build the package by running `yarn workspace @motech-development/serverless-outputs-env build`\
Test the package by running `yarn workspace @motech-development/serverless-outputs-env test`

### Webpack conditional plugin

A Webpack plugin to conditionally apply plugins

Build the package by running `yarn workspace @motech-development/webpack-conditional-plugin build`\
Test the package by running `yarn workspace @motech-development/webpack-conditional-plugin test`

### Webpack permissions plugin

A Webpack plugin to set permissions for your output files and folders

Build the package by running `yarn workspace @motech-development/webpack-permissions-plugin build`\
Test the package by running `yarn workspace @motech-development/webpack-permissions-plugin test`

### Yarn dedupe plugin

Run Yarn dedupe after every installation

### Yarn prepare plugin

Run Yarn prepare after every installation
