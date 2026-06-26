---
author: André Lademann
pubDatetime: 2022-10-20T00:00:00.000Z
title: "API REST Clients for testing in 2022"
slug: api-rest-clients-for-testing-in-2022
featured: false
draft: true
tags:
  - api
  - testing
  - tools
description: "A comparison of graphical REST API clients — why they beat curl for exploring undocumented APIs like Keycloak."
---

Today I searched the Keycloak API for the name of the user's email field.

Keycloak comes with a REST API but it's not well documented. In cases like this, I like to take a look at the responses directly.

Using graphical user interfaces for API requests has some benefits over calling with `curl`:

- You can save and organise different requests
- You can save credentials such as tokens
- You can set up different environments
- You can create monitoring and tests
- You can create living, publicly available documentation
- You can collaborate with others
