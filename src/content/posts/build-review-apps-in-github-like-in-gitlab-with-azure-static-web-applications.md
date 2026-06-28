---
author: André Lademann
pubDatetime: 2023-09-25T00:00:00.000Z
title: "Build Review Apps in GitHub Like in GitLab with Azure Static Web Applications"
slug: build-review-apps-in-github-like-in-gitlab-with-azure-static-web-applications
featured: false
draft: false
tags:
  - azure
  - github-actions
  - devops
heroImage: /images/posts/build-review-apps-in-github-like-in-gitlab-with-azure-static-web-applications/hero.jpg
description: "GitLab makes it trivial. Here's how to get the same isolated preview environments on GitHub using Azure Static Web Applications and GitHub Actions."
---

With GitLab, automatically deploying a review app — or _preview environment_, as Azure calls it — for each merge request is almost effortless. Each one gets its own URL, so new features can be tested in complete isolation. Compared to a shared staging system, this saves a lot of grief with merge conflicts and unintended side effects.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1695326067043/c92df18f-e53c-49ff-b46a-f05a15136c00.png)

You can achieve the same thing with GitHub Actions. This article shows one approach via Azure Static Web Applications (SWA).

## Why It's Worth Setting Up

Azure Static Web Applications are free of charge. You get a URL, an SSL certificate, and storage space — with no configuration overhead to speak of.

1. GitHub Actions workflows for building and deploying are provided out of the box.
2. Review apps are automatically linked in pull requests as a status check. When a pull request is closed, the environment is torn down automatically.

## Where It Falls Short

This approach is primarily suited to static websites. That said, it's also conceivable to host build artefacts (dmg, exe, jar files) for download via a preview URL — it doesn't have to be just HTML.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1695325716895/3db9944d-9b78-499d-bbb7-fa1f011b144d.png)

## Alternatives Worth Knowing

Several other platforms offer free static hosting and fit the same pattern well:

- [surge.sh](https://surge.sh) — a simple command-line tool, very low friction to get started
- [Vercel](https://vercel.com)
- [Netlify](https://www.netlify.com/)
- [AWS S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

---

## See It in Action

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1695646355214/86caaa8c-6ab0-4050-9d1f-be65474b2c35.png)

Review apps linked directly in the GitHub pull request — no manual deployment step needed.

## The Takeaway

_Review apps_ are the cleanest way to test individual features without polluting a shared environment. The effort to set them up varies depending on the stack, but for static web applications it's minimal.

Azure Static Web Apps provide a straightforward integration point for GitHub Actions. If Azure isn't your thing, [Surge.sh](https://surge.sh) is the quickest route to something running.

Have you set up review apps in your own pipeline? I'd be curious whether you went with a cloud provider or something more self-hosted.
