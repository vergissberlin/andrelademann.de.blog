---
author: André Lademann
pubDatetime: 2022-09-15T00:00:00.000Z
title: "MAKE it beautiful"
slug: make-it-beautiful
featured: false
draft: true
tags:
  - devops
description: "A proposal for a standardised Make API across all dockerised projects — one consistent interface for up, down, build, test, db, cache and more."
---

## 📚 Relevant data

[GNU Make](https://www.gnu.org/software/make/) is a tool that controls the creation of executables and other non-source files of a programme from the programme's source files.

Make gets its knowledge of how to build your programme from a file called Makefile. Make is available for all operating systems, but is not installed by default.

In the company I work for, we use _Make_ as a task manager for our dockerised applications to get a shortened notation, e.g. to start an application:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

becomes

```bash
make up
```

## 🚀 Proposals

### 1) Open-close principle

To ensure that the API is the same everywhere, one should/could include the upcoming basic functions as git submodules. However, it must be ensured that the API can be easily extended/overwritten in the respective project. (Example `make app:cache` can look different in every project, because the path to the tmp directories is different).

### 2) API proposal

```makefile
make up
make down
make update # composer, yarn, npm, …
make status
make test
make build
make bash
make reset

make assets:dev
make assets:prod
make assets:watch

make db:snapshot
make db:export
make db:import
make cache:clear
make cache:flush

make config:create
make config:xdebug enable
make config:xdebug disable

make app:share
make app:launch
make help
```
