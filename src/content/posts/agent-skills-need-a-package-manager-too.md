---
author: André Lademann
pubDatetime: 2026-07-20T09:00:00.000Z
title: "Agent Skills Need a Package Manager Too"
slug: agent-skills-need-a-package-manager-too
featured: false
draft: false
tags:
  - ai
  - tools
  - devops
  - enterprise
description: "Skills are becoming how enterprises encode their processes for AI agents — but where does the code live, who owns it, and how does a repo declare which ones it needs? A package manager problem in disguise…"
canonicalURL: https://blog.andrelademann.de/agent-skills-need-a-package-manager-too
---

In a professional setting, Skills stop being a personal convenience trick and start being infrastructure. You're not writing a Skill so your own agent remembers how you like your commit messages formatted — you're encoding an actual company process: how your team triages incidents, how a specific client's deployment pipeline works, how your organisation wants pull requests reviewed. Once that's true, a new question shows up immediately: who owns this, and where does the code for it actually live?

## The scope question comes first

Before you even get to storage, you have to answer a scoping question. Is a Skill something one team owns, or something the whole company shares?

Team-scoped Skills make sense for anything tied to a specific codebase or workflow — the on-call runbook for a particular service, the review checklist for a particular repo. Company-scoped Skills make sense for anything that should behave the same everywhere — how invoices get processed, how customer data gets handled, how a security incident gets escalated regardless of which team is holding the pager.

Get this wrong and you end up with either duplicated Skills drifting apart across teams, or a single monolithic Skill repository that nobody wants to touch because half of it doesn't apply to them. Either way, it's the same failure mode we've already seen with shared libraries and internal tooling.

## We've solved this exact problem before

Here's the thing: "where does the code for this shared capability live, and how does a project declare which version it depends on" is not a new question. It's dependency management, just for agent capabilities instead of application code. We solved it for JavaScript with npm, for Python with pip, for Rust with cargo. The pattern is always the same — a registry, a manifest that declares what you need, a lock file that pins exactly what you got, and a CLI that reconciles the two.

Skills need exactly that, and the ecosystem is starting to converge on it. The most promising entry right now is [`npx skills`](https://github.com/vercel-labs/skills) from Vercel Labs — genuinely "npm, but for agent Skills". You add a Skill to a project, and it writes an entry into a `.skills.json` manifest plus a `skills-lock.json` lock file, the same two-file split npm uses:

```bash
# Add a skill to the current project
npx skills add playwright-cli

# See what's installed
npx skills list

# Search the registry
npx skills find incident-response
```

Crucially, it installs Skills as symlinks into a canonical location by default, rather than copying `SKILL.md` files into every repo that needs them. That's the detail that matters most for a company-wide rollout: your security-incident Skill lives in one place, gets updated in one place, and every repo that references it picks up the update — instead of forty stale copies pasted around your organisation, each one silently diverging from the version someone actually reviewed.

## The gap: restoring from the lock file

Here's where "experimental" becomes the honest word for where this stands today. `skills-lock.json` records exactly which Skills — and which versions — a project depends on. That's the equivalent of `package-lock.json`. What's still missing is the equivalent of `npm ci`: a reliable, idempotent command that takes a fresh clone and a lock file and reproduces the exact same set of Skills, with a non-zero exit code if it can't.

`npx skills update` only works on a machine that already has the Skills installed — which is precisely useless for a new team member's laptop, a CI runner, or a freshly cloned repo. That gap is tracked and known ([vercel-labs/skills#549](https://github.com/vercel-labs/skills/issues/549)), and the interim answer is the aptly-named `experimental_install`:

```bash
# Restore every skill listed in skills-lock.json — for now, experimental
pnpx skills experimental_install -y
```

That command name is doing useful work by telling the truth. It's the load-bearing feature for any team that wants to check in a manifest instead of copies of the files — and it isn't stable yet.

## Why a standard needs to land soon

This is exactly the moment where things can go one of two ways. Either the ecosystem converges on one manifest format, one lock-file shape, and one install semantics — the way npm eventually became the default answer for JavaScript, even though alternatives existed — or every agent vendor and every internal platform team invents a slightly different `skills.json` shape, and companies end up maintaining translation layers between them.

For an enterprise adopting this, the stakes are the practical ones you'd apply to any dependency management decision:

- **Provenance and review** — a lock file only protects you if you know what was actually reviewed before it landed there, same as any other supply-chain concern.
- **Least privilege** — a Skill that can rewrite deployment configuration is a bigger blast radius than one that only reads a runbook. Scope what each Skill is allowed to touch, not just what it's convenient for it to touch.
- **Reproducibility** — "works on my machine" is exactly as unacceptable for Skills as it is for application dependencies. The install step has to be boring and deterministic.
- **Auditability** — if a Skill changes how your team handles customer data, someone needs to be able to answer "who approved this version, and when" without archaeology.

None of that is solved by picking a tool. It's solved by treating Skills as first-class dependencies from day one — versioned, reviewed, and reproducible — rather than as convenient snippets someone pasted into a repo because it was faster than asking for a shared location.

We've built this discipline before, for every other kind of dependency our industry has produced. It's worth building it early this time, before forty slightly different `skills.json` dialects make it expensive to unify later. Has your team already settled on how it manages shared Skills, or is everyone still pasting `SKILL.md` files around and hoping for the best?
