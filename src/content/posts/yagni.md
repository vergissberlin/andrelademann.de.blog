---
author: André Lademann
pubDatetime: 2021-08-10T00:00:00.000Z
title: "YAGNI"
slug: yagni
featured: false
draft: true
tags:
  - design-patterns
  - clean-code
description: "You Aren't Gonna Need It — why building features before they're requested burns money and complicates codebases."
---

Often I remember I want to make it just a piece better, and better, and better … it feels so good to give your little baby an extra polish.

> "You never know boss, maybe the customer needs a second contact form later on, so let me do that generic form wrapper!" 🧑‍💻

We have so many excuses for that, but if we are truly honest with ourselves — we know deep down that we ain't gonna need that feature in the future, and all the extra money is burned. At least for the customer.

## How to

![burn money](https://media.giphy.com/media/opP9JMYfG9a1y/giphy.gif)

A change in perspective is very useful. Would you like to see someone burn your money for something you haven't, never, ever ordered? I think the answer is given.

## Reasons not to follow YAGNI

### Distinguish between functional and modular code

![NEEEED](https://media.giphy.com/media/cIi3MlulIuFYMA5CpF/giphy-downsized.gif)

Please keep in mind that this rule of thumb is **always related to functions or templates**. The rule is not meant to stop you from creating new classes or modules. So if you want to build a _factory_ for your different types of products, feel free to do it!

### But we will really need it later

![I need that shit](https://media.giphy.com/media/U72OPYcmYDadBeRYaZ/giphy-downsized.gif)

Sometimes you know that doing it the easy way now will cost more later. That's something to discuss with the product owner. Even if it is more expensive in the end, the client may prefer to build a prototype first — this is the case with an MVP ([minimum viable product](https://en.wikipedia.org/wiki/Minimum_viable_product)).
