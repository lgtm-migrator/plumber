# ultimate-probot | [![Unit tests](https://github.com/jamacku/ultimate-probot/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/jamacku/ultimate-probot/actions/workflows/unit-tests.yml)

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

## Setup

```sh
# Install dependencies
npm install

# Compile sources
npm run build

# Run tests
npm run tests

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t ultimate-probot .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> ultimate-probot
```

## License

[GPL-3.0](LICENSE) © 2021 Jan Macku <jamacku@redhat.com>
