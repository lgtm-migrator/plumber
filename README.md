
<p align="center">
  <img src="docs/images/green-plumber.png" width="100" />
  <h1 align="center">Plumber</h1>
</p>

[![Unit tests](https://github.com/jamacku/plumber/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/jamacku/plumber/actions/workflows/unit-tests.yml) [![Total alerts](https://img.shields.io/lgtm/alerts/g/jamacku/plumber.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jamacku/plumber/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/jamacku/plumber.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/jamacku/plumber/context:javascript) [![codecov](https://codecov.io/gh/jamacku/plumber/branch/main/graph/badge.svg?token=unm06qu4vI)](https://codecov.io/gh/jamacku/plumber)

[![Mergify Status][mergify-status]][mergify] [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

[mergify]: https://mergify.com
[mergify-status]: https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/jamacku/plumber&style=flat

## About

Plumber is a GitHub App built with [Probot](https://github.com/probot/probot) that helps to automate source-git workflows of [Red Hat Plumbers team](https://github.com/redhat-plumbers). Plumber is closely integrated with [Red Hat Bugzilla](https://github.com/redhat-plumbers), using NodeJs module [bugzilla](https://github.com/Mossop/bugzilla-ts).

List of features:
* Commit message linting (_Resolves_, _Related_)
* Support for Bugzilla flags (_qa_ack_, _devel_ack_, _release_, etc.)
* Y-stream, Z-stream and multi-release support
* Configurable

...

### Examples

...

## Usage

...

### Configuration

...

## Development

...

```sh
# Install dependencies
yarn

# Compile sources
yarn build

# Run tests
yarn test

# Run the bot
yarn start
```

### Docker

...

```sh
# 1. Build container
docker build -t plumber .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> plumber
```
