# ultimate-probot | [![Unit tests](https://github.com/jamacku/ultimate-probot/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/jamacku/ultimate-probot/actions/workflows/unit-tests.yml) [![Total alerts](https://img.shields.io/lgtm/alerts/g/jamacku/ultimate-probot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jamacku/ultimate-probot/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/jamacku/ultimate-probot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jamacku/ultimate-probot/context:javascript) [![codecov](https://codecov.io/gh/jamacku/ultimate-probot/branch/main/graph/badge.svg?token=unm06qu4vI)](https://codecov.io/gh/jamacku/ultimate-probot)

[![Mergify Status][mergify-status]][mergify] [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

[mergify]: https://mergify.com
[mergify-status]: https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/jamacku/ultimate-probot&style=flat

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
