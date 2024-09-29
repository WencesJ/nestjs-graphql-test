<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.yarnjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/yarn/v/@nestjs/core.svg" alt="yarn Version" /></a>
<a href="https://www.yarnjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/yarn/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.yarnjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/yarn/dm/@nestjs/common.svg" alt="yarn Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# NestJS GraphQL API Starter

## Description

This is a [NestJS](https://github.com/nestjs/nest) GraphQL API starter repository with TypeScript, Prisma, and PostgreSQL. It provides a solid foundation for building scalable and maintainable GraphQL APIs.

## Prerequisites

- Node.js (v16 or later)
- Yarn package manager
- Docker (Optional - for running PostgreSQL in a container)

## Installation

```bash
$ yarn install
```

## Database Setup

### Option 1: Using Docker (Recommended)

Ensure Docker is installed and running on your machine.

1. Start the PostgreSQL database:

```bash
$ yarn docker:db:start
```

This command will start a PostgreSQL instance and create both a main database and a test database.

2. Stop the database (when you're done testing/running the application):

```bash
$ yarn docker:db:stop
```

### Option 2: Local PostgreSQL Instance

If you prefer to use a local PostgreSQL instance, ensure it's installed and running. Create and update the `.env` file with your database credentials.

## Prisma Setup

After setting up the database, synchronize the Prisma schema:

```bash
$ yarn prisma migrate deploy
```

This command will apply all migrations to your database.

## Environment Variables

Copy the `.env.example` file to `.env` and update the variables as needed:

```bash
$ cp .env.example .env
```

Make sure to set the correct `DATABASE_URL` in both `.env` and `.env.test` files.

## Running the Application

```bash
# Development mode
$ yarn start

# Watch mode (auto-reload on changes)
$ yarn start:dev

# Production mode
$ yarn start:prod
```

## Testing

Before running tests, ensure your `.env.test` file has a valid database URL. If you're using the Docker setup, this should be pre-configured. It is advisable for `.env.test` database url is different from `.env` database url

```bash
# Unit tests
$ yarn test

# End-to-end tests
$ yarn test:e2e

# Test coverage
$ yarn test:cov
```
## GraphQL Server Url

Once the application is running, you can access the GraphQL Server Url at:

```
http://localhost:3000
```

## GraphQL Playground

Once the application is running, you can access the GraphQL Playground at:

```
http://localhost:3000/graphql
```

Use this interface to explore and test your GraphQL API.

## Project Structure

```
prisma/             # Prisma schema and migrations
src/
├── auth/           # Authentication related files
├── user/           # User module
├── interface/      # Application shared interfaces
├── utils/          # Shared utilities and constants and configuration files
├── app.module.ts   # Main application module
└── main.ts         # Application entry point
```

## Best Practices

1. Keep your resolvers thin and move business logic to services.
2. Use DTOs (Data Transfer Objects) for input validation.
3. Implement proper error handling using NestJS exceptions.
4. Write unit tests for services and e2e tests for resolvers.
5. Use environment variables for configuration.
6. Keep your Prisma schema updated and run migrations for any changes.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Stay in touch

- Author - [Wenceslas E. Jonah](https://github.com/wencesj)
