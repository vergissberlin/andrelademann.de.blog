---
author: André Lademann
pubDatetime: 2021-08-10T00:00:00.000Z
title: "YAGNI"
slug: yagni
featured: false
draft: false
tags:
  - design-patterns
  - clean-code
heroImage: /images/posts/yagni/hero.jpg
description: "You Aren't Gonna Need It — why building features before they're requested burns money and complicates codebases."
---

Often I remember I want to make it just a piece better, and better, and better… it feels so good to give your little baby an extra polish.

> "You never know boss, maybe the customer needs a second contact form later on, so let me do that generic form wrapper!" 🧑‍💻

We have so many excuses for that. But if we're truly honest with ourselves — we know deep down that we ain't gonna need that feature in the future, and all the extra money is burned. At least for the customer.

## How to Think About It

![burn money](https://media.giphy.com/media/opP9JMYfG9a1y/giphy.gif)

A change of perspective is useful here. Would you like to watch someone burn your money on something you never ordered? I think the answer is clear.

The pattern plays out in code all the time:

```javascript
// ❌ Building a "generic form system" before anyone asked for one
class FormBuilder {
  constructor(config) { /* ... */ }
  addField(name, type, validators = []) { /* ... */ }
  addAsyncValidator(fn) { /* ... */ }
  render(container) { /* ... */ }
}

// ✅ The ticket asked for a contact form — so write a contact form
document.querySelector('#contact-form')
  .addEventListener('submit', (e) => {
    e.preventDefault();
    sendContactEmail(new FormData(e.target));
  });
```

The `FormBuilder` is satisfying to write. It's also three days of work nobody requested, with a test surface nobody will maintain.

## Reasons Not to Follow YAGNI

### Distinguish Between Functional and Modular Code

![NEEEED](https://media.giphy.com/media/cIi3MlulIuFYMA5CpF/giphy-downsized.gif)

Keep in mind that this rule of thumb is **always about functions and templates**, not about structure. It's not telling you to stop creating classes or modules. If you want to build a _factory_ for your different product types, go ahead — that's sensible design, not premature speculation.

### But We'll Really Need It Later

![I need that](https://media.giphy.com/media/U72OPYcmYDadBeRYaZ/giphy-downsized.gif)

Sometimes you genuinely know that taking the easy route now will cost more later. That's worth a conversation with the product owner. Even if the upfront investment is higher, the client may prefer to build a prototype first — this is precisely the case with an MVP ([minimum viable product](https://en.wikipedia.org/wiki/Minimum_viable_product)).

The key word is _know_. If you're speculating, it's YAGNI. If you have a roadmap item, a written requirement, or a concrete deadline — that's a different conversation entirely.

What's the most elaborate "just in case" feature you've seen built that never got used? I'd love to hear it.
