---
author: André Lademann
pubDatetime: 2026-06-28T09:00:00.000Z
title: "MCP Servers in the Enterprise: The Speed-vs-Security Trap"
slug: mcp-servers-speed-vs-security-enterprise
featured: false
draft: true
tags:
  - mcp
  - security
  - enterprise
  - developer-experience
description: "New MCP servers drop every day, and they're genuinely useful — but in an enterprise context, every one of them is a door you're propping open..."
canonicalURL: https://blog.andrelademann.de/mcp-servers-speed-vs-security-enterprise
---

I've written a handful of MCP servers myself. It's honestly one of the more satisfying things you can build right now — a few hundred lines of code, and suddenly your AI assistant can talk to your ticketing system, pull data from your monitoring stack, or push commits on your behalf. The feedback loop from "idea" to "working tool" is absurdly short.

And that's exactly what makes this exciting. And a little bit terrifying.

New MCP servers land on GitHub and npm every single day. Model Context Protocol adoption has exploded — there are servers for Slack, Jira, Kubernetes, Notion, your NAS, your home automation system, your CRM. If you can think of an integration, someone has probably already built it, or they will by Thursday. In a personal context, this is brilliant. You grab the server, wire it into Claude or whatever agent you're running, and you're done.

In an enterprise context, "you're done" should give you pause.

## Every MCP server is a trust decision in disguise

When you install an MCP server, you're doing something more significant than it looks. You're giving an AI system — and whoever controls it — a tool that can act in your name. Depending on what the server does, that might mean reading files, querying databases, calling internal APIs, or sending messages to colleagues.

The MCP server itself is software you didn't write. That means you're trusting:

- The author's intentions
- The author's implementation quality
- The supply chain that built it (its own dependencies)
- The ongoing maintenance of all the above

This is no different from any third-party dependency you'd pull into a production codebase. Except the blast radius is different. A dodgy npm package in a web app might serve malicious JS to your users. A dodgy MCP server might exfiltrate your internal API tokens, your customer data, or your source code — through the same AI that's supposed to be helping you.

**Prompt injection through MCP tool responses is a real attack vector**, by the way. A malicious server can return crafted content that nudges the model into doing something unintended. If the model has access to other tools — say, a file system or a code executor — that's a meaningful risk that's easy to underestimate when you're just trying to get your Jira integration working.

## The enterprise context changes everything

In a personal project, your risk tolerance is your own business. In an enterprise setting, you're managing someone else's data, someone else's infrastructure, and someone else's regulatory obligations. That changes the calculus significantly.

The specific pressures:

**Compliance** — If you're operating under GDPR, SOC 2, ISO 27001, or any number of sector-specific frameworks, you have obligations around data handling that don't bend because your developer found a convenient new tool. An MCP server that logs tool calls — even for debugging purposes — might be storing data you're not allowed to hand over to a third party.

**Blast radius** — In an enterprise environment, an MCP server typically has access to more things. It might be authenticated against your cloud provider, your internal APIs, your communication tools. A compromised server isn't a personal inconvenience — it's an incident.

**Visibility** — Who knows what MCP servers your team is running? If the answer is "nobody", you already have a shadow IT problem. The speed at which developers adopt these tools tends to outpace the speed at which security teams hear about them.

## What "reviewing" an MCP server actually looks like

I won't pretend this is simple. Reviewing software at scale is hard, and expecting developers to do a thorough security audit before every new tool they try isn't realistic. But there's a middle ground between "ship it" and "full penetration test".

When I evaluate an MCP server — mine or someone else's — I look at a few things:

**Network calls** — Does it phone home? Does it send anything to a third-party endpoint? A server that wraps a local CLI tool and makes zero outbound calls is a much smaller risk than one with its own cloud backend.

**Credential handling** — How does it receive and store API keys? Are they logged anywhere? Are they passed through environment variables (fine) or baked into config files that might end up in version control (not fine)?

**Scope of permissions** — Does the server's tool set match what you actually need? A Jira MCP server that can also delete projects is offering more attack surface than one that can only read tickets. Prefer servers that implement the principle of least privilege — and if the server doesn't, fork it and strip it down.

**Source availability and activity** — Is the code open? Is it maintained? A single-file project with no issues, no PRs, and a two-year-old last commit is a different risk profile from an actively maintained one with a transparent changelog.

**Dependencies** — Run a quick `npm audit` or equivalent. Not because this catches everything, but because it costs almost nothing and filters out the obvious.

```bash
# Takes 10 seconds, occasionally saves you from yourself
cd your-mcp-server && npm audit --audit-level=high
```

None of this is a guarantee. But it's a starting point that takes minutes, not days.

## The trap is real, and it's not going away

Here's the honest version of the problem: teams that move fastest with AI tooling will have a real productivity advantage over teams that don't. That advantage is measurable, and it's growing. At the same time, the risk surface is growing at least as fast.

The temptation is to treat this as a binary — either you adopt everything quickly or you lock everything down. But that's a false choice. What you actually need is a lightweight, repeatable evaluation process that can keep pace with the rate of adoption, and a culture where "I added a new MCP server" is something developers report rather than hide.

I don't think most enterprises have that yet. Have you managed to build one — and if so, what does it actually look like in practice?
