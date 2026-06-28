---
author: André Lademann
pubDatetime: 2021-07-28T08:44:12.000Z
title: "Pair programming"
slug: pair-programming
featured: false
draft: false
tags:
  - collaboration
ogImage: "/images/posts/pair-programming/hero.jpeg"
description: "In pair programming, two developers work simultaneously on one source code. The method helps to develop better software products. Advantages At Netresearch, we use this method and derive many advantages from it: Direct knowledge exchange about meth..."
canonicalURL: https://blog.andrelademann.de/pair-programming
---

In pair programming, two developers work simultaneously on one source code. The method helps to develop better software products.

## Advantages

At Netresearch, we use this method and derive many advantages from it:

- Direct knowledge exchange about methods, tools used and ways of working.
- Improvement of code quality through direct code review, which leads to more robust code.
- Improving collaboration through communication
- When you have to describe approaches verbally, new ideas come up and thinking errors are noticed.
- In dialogue, the best solution can be found.
- A shared sense of achievement makes people more satisfied with the result.

## Stereotype

In the short term, you might think that you need twice as much development time for a feature, but in fact, **the elimination of a code review, the exchange of knowledge and the more robust code do not result in additional costs in the long term**.

## Disadvantages

The strong feeling that you are desperate to get to the keyboard because you just can't seem to describe the problem in a way that your co-pilot understands. This can take years of your life and lead to grey hair! Also, your nails may break if you grip the seat cushion of your office chair too hard.

## Rules

You and your boss are convinced, and you wonder how to start? There are a few rules for pair programming that you should follow:

1. Switch keyboard control at least every 15 Minutes. It helps that both programmers are on track, the hole time.
2. Writing code is accompanied by language.
3. You have to pinch yourself to say, "I'll do it quickly".
4. Pair programming is not a must. Sometimes there are routine tasks where knowledge cannot be shared.
5. Tidy up your desk to prepare that you are not alone.
6. If your meat each other in real life, take a shower in the morning :D

## Pair programming remotely

Sitting together at a computer is probably the most beautiful thing of all. Probably many stock photos were taken during pair programming, where one of the developers smiles and points at the monitor. Something silly [like that](https://www.netresearch.de/blog/webseiten-bauen-im-schuelerpraktikum-bei-netresearch/) ... or [this](https://www.netresearch.de/blog/schuelerpraktikum-bei-netresearch/) ! tsss ...

But how does pair programming work when the workplaces are kilometres apart? There are a few techniques for this, such as [git handover](https://www.remotemobprogramming.org/), but what I would like to introduce today is **Code With Me** by JetBrains.

![JetBrains IDE during a Code With Me pair programming session with docker-compose.yml open and video chat](/images/posts/pair-programming/img-1.png)

One day I actually read through one of the tips that pop up when you open _Android Studio_ / _WebStorm_ / _PHPStorm_ / _RubyMine_ / _PyCharm_ / _GoLand_ / _CLine_ or another derivate of IntelliJ IDE and discovered this feature. There are already several other editors that allow you to work together on a file, but with _Code With Me_, JetBrains from the Czech Republic has taken it to a new level.

1. Invitations to a pair programming session via a link,
2. control of access rights,
3. audio and video chat are also integrated.
4. A follow-up mode, in which you can also follow when your partner opens a new file or scrolls down.

You can start a pair programming session by clicking on the user icon in the top right-hand corner.

![Code With Me dropdown menu in a JetBrains IDE with Enable Access and Copy Invitation Link highlighted](/images/posts/pair-programming/img-2.png)

---

## Summary

I don't want to repeat the prejudice, but you should know them if your project manager counter-argues with the following arguments in order to be prepared. The prejudice "One problem to solve + two programmers working on it = twice the effort" is false. You improve code quality, which mean at least less bugs. You share knowledge and improve your communication skills.

## Questions

Have you ever tried _couples programming_ or even _mob programming_ at regular intervals? What are your experiences with it? How have your bosses reacted?
