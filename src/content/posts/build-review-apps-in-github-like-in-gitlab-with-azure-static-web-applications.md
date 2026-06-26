---
author: André Lademann
pubDatetime: 2023-09-25T00:00:00.000Z
title: "Build review apps in GitHub like in GitLab with Azure Static Web Applications"
slug: build-review-apps-in-github-like-in-gitlab-with-azure-static-web-applications
featured: false
draft: true
tags:
  - azure
  - github-actions
  - devops
description: "How to automatically deploy isolated preview environments for every pull request using Azure Static Web Applications and GitHub Actions."
---

With Gitlab, it is easy to automatically deploy a review app (or _preview environment_ like it's called in Azure) for each merge request, which can then be tested under its own domain. The big advantage here is that compared to a "testing" or "staging" system, new features can be tested in isolation. This usually saves trouble with merge conflicts and unwanted side effects.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1695326067043/c92df18f-e53c-49ff-b46a-f05a15136c00.png)

Review apps can also be created with GitHub Actions. I show one way — via Azure Static Web Applications (SWA) — in this article.

## Pros

Azure Static Web Applications are free of charge. You get a URL, an SSL certificate and storage space.

1. GitHub Actions are provided for building and deploying.
2. Review apps are automatically linked in pull requests. When closing a pull request, the review app can be deleted automatically.

## Cons

This method is mainly suitable for static websites. However, it is also conceivable to offer artefacts (dmg, exe, jar files) for download in this way.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1695325716895/3db9944d-9b78-499d-bbb7-fa1f011b144d.png)

## Alternatives

It is also conceivable to deploy on other platforms that often offer the possibility to host static websites for free:

- [surge.sh](https://surge.sh) (simple commandline tool)
- [vercel.com](https://vercel.com)
- [Netlify](https://www.netlify.com/)
- [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

---

## See it in action

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1695646355214/86caaa8c-6ab0-4050-9d1f-be65474b2c35.png)

## Summary

_Review apps_ aka _preview environments_ are the best way to test individual features in isolation. The effort required to deploy them automatically differs depending on the technology used. It is easiest for static web applications.

Azure Static Web Apps (SWA) provide a simple solution to integrate into your pipeline. [Surge.sh](https://surge.sh) is a good alternative.
