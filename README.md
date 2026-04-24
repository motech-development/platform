[![Deploy to production](https://github.com/motech-development/platform/actions/workflows/deploy-to-production.yml/badge.svg)](https://github.com/motech-development/platform/actions/workflows/deploy-to-production.yml)
[![Deploy to develop](https://github.com/motech-development/platform/actions/workflows/deploy-to-develop.yml/badge.svg)](https://github.com/motech-development/platform/actions/workflows/deploy-to-develop.yml)
[![Production scheduled tests](https://github.com/motech-development/platform/actions/workflows/production-scheduled-tests.yml/badge.svg)](https://github.com/motech-development/platform/actions/workflows/production-scheduled-tests.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=motech-development_platform&metric=alert_status)](https://sonarcloud.io/dashboard?id=motech-development_platform)

# Platform

> Motech Development applications monorepo

## Getting started

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/motech-development/platform)

## Applications

A diverse set of applications built by Motech Development

### Accounts

Book keeping application to keep on top of your finances

Start the application by running `pnpm --filter @accounts/client run start`

### ID

Auth0 tenant

### Infrastructure

Motech Development cloud infrastructure as code

## Packages

Reusable NPM packages used in our applications

### API Gateway handler

Utility to make working with API gateway lambda functions less of a pain

Build the package by running `pnpm --filter @motech-development/api-gateway-handler run build`\
Test the package by running `pnpm --filter @motech-development/api-gateway-handler run test`

### AppSync Apollo

React Apollo client configured for AppSync

Build the package by running `pnpm --filter @motech-development/appsync-apollo run build`\
Test the package by running `pnpm --filter @motech-development/appsync-apollo run test`

### Auth

An Auth0 helper library for React

Build the package by running `pnpm --filter @motech-development/auth run build`\
Test the package by running `pnpm --filter @motech-development/auth run test`

### Axios hooks

Axios hooks for React

Build the package by running `pnpm --filter @motech-development/axios-hooks run build`\
Test the package by running `pnpm --filter @motech-development/axios-hooks run test`

### Breeze UI

Motech Development UI component library

Start storybook by running `pnpm --filter @motech-development/breeze-ui run start`\
Build the package by running `pnpm --filter @motech-development/breeze-ui run build`\
Test the package by running `pnpm --filter @motech-development/breeze-ui run test`

### GA Web Vitals

Google Analytics Web Vitals reporter

Build the package by running `pnpm --filter @motech-development/ga-web-vitals run build`\
Test the package by running `pnpm --filter @motech-development/ga-web-vitals run test`

### Logger

Application logger

Build the package by running `pnpm --filter @motech-development/node-logger run build`\
Test the package by running `pnpm --filter @motech-development/node-logger run test`

### Query string hook

A hook to access query strings

Build the package by running `pnpm --filter @motech-development/query-string-hook run build`\
Test the package by running `pnpm --filter @motech-development/query-string-hook run test`

### S3 file operations

A wrapper utility to manage file operations on AWS S3

Build the package by running `pnpm --filter @motech-development/s3-file-operations run build`\
Test the package by running `pnpm --filter @motech-development/s3-file-operations run test`

### Serverless outputs env

Serverless plugin to take AWS outputs and write them into `.env` files

Build the package by running `pnpm --filter @motech-development/serverless-outputs-env run build`\
Test the package by running `pnpm --filter @motech-development/serverless-outputs-env run test`

### Webpack conditional plugin

A Webpack plugin to conditionally apply plugins

Build the package by running `pnpm --filter @motech-development/webpack-conditional-plugin run build`\
Test the package by running `pnpm --filter @motech-development/webpack-conditional-plugin run test`

### Webpack permissions plugin

A Webpack plugin to set permissions for your output files and folders

Build the package by running `pnpm --filter @motech-development/webpack-permissions-plugin run build`\
Test the package by running `pnpm --filter @motech-development/webpack-permissions-plugin run test`
