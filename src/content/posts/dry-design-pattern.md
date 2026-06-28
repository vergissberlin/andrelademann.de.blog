---
author: André Lademann
pubDatetime: 2021-07-27T11:30:03.000Z
title: "DRY 🍸️ – design pattern"
slug: dry-design-pattern
featured: false
draft: false
tags:
  - design-patterns
  - design-principles
ogImage: "/images/posts/dry-design-pattern/hero.jpeg"
description: "Excuses to do it \"It's another project. I don't know much about it. Don't wanna break something, so I just copied it.\" \"I don't have time, maybe later …\" \"Maybe later on, I want to have something different in each function/template/class, so it's be..."
canonicalURL: https://blog.andrelademann.de/dry-design-pattern
---

## Excuses to do it

-   "It's another project. I don't know much about it. Don't wanna break something, so I just copied it."
-   "I don't have time, maybe later …"
-   "Maybe later on, I want to have something different in each function/template/class, so it's better to copy it."

## Advantages - to keep it DRY

-   If you have to change something later on, you may have to do it twice (or even multiple times) to achieve your goal. So it is easier to maintain.
-   Less code - is better code. Just remember, if you copy something, you must copy the tests as well! You do test, don't you? 🤨

## Ways to take care about it without even thinking

**Automatization** is the key. No matter which language do you use in your current project, there is a _copy paste detector_ out there. There are some for specific languages:

-   JavaScript [jscpd](https://www.npmjs.com/package/jscpd)
-   PHP [phpcpd](https://phpqa.io/projects/phpcpd.html)

… and some with cross language support like [PMD](https://pmd.github.io/) or [Basta](https://github.com/kucherenko/basta).

### Usage

Easy to install and simple to use. You can even export machine-readable reports to show the results in a graph over time, for example. In my case, I used XML for my C++ report, which is compatible with good old Jenkins.

```bash
./run.sh cpd --files /path/to/source --language cpp --format xml

```

## Summary

![Dry not shaken](/images/posts/dry-design-pattern/img-1.jpg)

It doesn't take much effort to keep things dry. Just pull up your pants and take care of it! Automation with tests and copy-and-paste detectors can help to improve your code quality and the maintainability of your software.

## Questions

1.  Are you try? Sometimes?
2.  Do you inspect your code automatically?
3.  If yes, which tool do you use to visualize the results?
