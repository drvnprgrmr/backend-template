# Notes
- when the same type of error is sent more than once, create an exception class for it
- use 'count' for field names that indicate the number of items of a document or object

# Todo
- add user email to request after guard
- do more research on efficient text search for large collections
- add throttler globally
- create store for throttler (mongo or redis)
- add multiple email capability (with default)
- add multifactor authentication; also add "view" to verify code
    - implement with guard

# Getting started

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
