---
author: André Lademann
pubDatetime: 2022-10-25T00:00:00.000Z
title: "git rebase -Xtheirs and -Xours: Resolving Conflicts Automatically"
slug: git-rebase-theirs-probleme-beim-rebase-beheben
featured: false
draft: false
tags:
  - git
  - developer-experience
heroImage: /images/posts/git-rebase-theirs-probleme-beim-rebase-beheben/hero.jpg
description: "How -Xtheirs and -Xours work in git rebase — and why they mean the exact opposite of what you'd expect."
---

You've been working on a feature branch for a couple of weeks. Master has moved on. You run `git rebase master` and get a wall of conflicts — even though you know your branch is correct and you just want its changes to win. Resolving each file by hand is tedious and error-prone.

There's a cleaner way.

Since Git 1.7.3, you can pass a strategy option to `git rebase` that tells it which side to prefer automatically.

## -Xtheirs and -Xours: What They Actually Mean

```bash
# check which branch you're on
$ git branch
* branch-a

# rebase, automatically preferring branch-a on conflicts
$ git rebase -Xtheirs branch-b
```

Here's the part that trips nearly everyone up: **`-Xtheirs` favours your current branch** (`branch-a`) — not the branch you're rebasing onto. The naming is counterintuitive, and it's the direct opposite of how `git merge` uses the same flags:

```bash
$ git rebase -Xtheirs branch-b  # ours = branch-b,  theirs = branch-a
$ git merge  -Xtheirs branch-b  # ours = branch-a,  theirs = branch-b
```

The reason: `git rebase` replays your commits on top of the target branch. From Git's perspective, the target branch is "ours" and the commits being replayed are "theirs" — even though those commits are yours. It reflects the internal mechanics of how rebase works, not whose code it is.

## The Practical Takeaway

If you're merging changes from `origin/master` and want your current branch to win on any conflict:

```bash
$ git merge -Xours origin/master
```

If you're rebasing your feature branch onto master and want your feature branch to win:

```bash
$ git rebase -Xtheirs master
```

A quick rule of thumb to save somewhere visible: **in a rebase, "theirs" means your own commits.** I still look this up occasionally — and now you won't have to.

Have you found a better mnemonic for this? I'd genuinely appreciate one.
