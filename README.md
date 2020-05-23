[![CircleCI](https://circleci.com/gh/motech-development/platform.svg?style=shield)](https://circleci.com/gh/motech-development/platform)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=motech-development_platform&metric=alert_status)](https://sonarcloud.io/dashboard?id=motech-development_platform)

# Platform

> Motech Development applications monorepo

## Applications

A diverse set of applications built by Motech Development

### Accounts

Book keeping application to keep on top of your finances

Start the application by running `npm start -- --scope=@motech-development/accounts-client`

### ID

Auth0 tenant

### Infrastructure

Motech Development cloud infrastructure as code

### Open banking

Open Banking API

## Packages

Reusable NPM packages used in our applications

### Auth

An Auth0 helper library for React

Build the package by running `npm run build -- --scope=@motech-development/auth`\
Test the package by running `npm test -- --scope=@motech-development/auth`

### Breeze UI

Motech Development UI component library

Start storybook by running `npm start -- --scope=@motech-development/breeze-ui`\
Build the package by running `npm run build -- --scope=@motech-development/breeze-ui`\
Test the package by running `npm test -- --scope=@motech-development/breeze-ui`

### Serverless outputs env

Serverless plugin to take AWS outputs and write them into `.env` files

Build the package by running `npm run build -- --scope=@motech-development/serverless-outputs-env`\
Test the package by running `npm test -- --scope=@motech-development/serverless-outputs-env`
