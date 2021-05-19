[![Deploy to production](https://github.com/motech-development/platform/actions/workflows/deploy-to-production.yml/badge.svg)](https://github.com/motech-development/platform/actions/workflows/deploy-to-production.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=motech-development_platform&metric=alert_status)](https://sonarcloud.io/dashboard?id=motech-development_platform)

# Platform

> Motech Development applications monorepo

## Applications

A diverse set of applications built by Motech Development

### Accounts

Book keeping application to keep on top of your finances

Start the application by running `yarn start --scope=@accounts/client`

### ID

Auth0 tenant

### Infrastructure

Motech Development cloud infrastructure as code

### Open banking

Open Banking API

## Packages

Reusable NPM packages used in our applications

### API Gateway handler

Utility to make working with API gateway lambda functions less of a pain

Build the package by running `yarn build --scope=@motech-development/api-gateway-handler`\
Test the package by running `yarn test --scope=@motech-development/api-gateway-handler`

### AppSync Apollo

React Apollo client configured for AppSync

Build the package by running `yarn build --scope=@motech-development/appsync-apollo`\
Test the package by running `yarn test --scope=@motech-development/appsync-apollo`

### Auth

An Auth0 helper library for React

Build the package by running `yarn build --scope=@motech-development/auth`\
Test the package by running `yarn test --scope=@motech-development/auth`

### Axios hooks

Axios hooks for React

Build the package by running `yarn build --scope=@motech-development/axios-hooks`\
Test the package by running `yarn test --scope=@motech-development/axios-hooks`

### Breeze UI

Motech Development UI component library

Start storybook by running `yarn start --scope=@motech-development/breeze-ui`\
Build the package by running `yarn build --scope=@motech-development/breeze-ui`\
Test the package by running `yarn test --scope=@motech-development/breeze-ui`

### GA Web Vitals

Google Analytics Web Vitals reporter

Build the package by running `yarn build --scope=@motech-development/ga-web-vitals`\
Test the package by running `yarn test --scope=@motech-development/ga-web-vitals`

### Query string hook

A hook to access query strings

Build the package by running `yarn build --scope=@motech-development/query-string-hook`\
Test the package by running `yarn test --scope=@motech-development/query-string-hook`

### S3 file operations

A wrapper utility to manage file operations on AWS S3

Build the package by running `yarn build --scope=@motech-development/s3-file-operations`\
Test the package by running `yarn test --scope=@motech-development/s3-file-operations`

### Serverless outputs env

Serverless plugin to take AWS outputs and write them into `.env` files

Build the package by running `yarn build --scope=@motech-development/serverless-outputs-env`\
Test the package by running `yarn test --scope=@motech-development/serverless-outputs-env`

### Webpack conditional plugin

A Webpack plugin to conditionally apply plugins

Build the package by running `yarn build --scope=@motech-development/webpack-conditional-plugin`\
Test the package by running `yarn test --scope=@motech-development/webpack-conditional-plugin`

### Webpack permissions plugin

A Webpack plugin to set permissions for your output files and folders

Build the package by running `yarn build --scope=@motech-development/webpack-permissions-plugin`\
Test the package by running `yarn test --scope=@motech-development/webpack-permissions-plugin`
