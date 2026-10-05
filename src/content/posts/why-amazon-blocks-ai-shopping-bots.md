---
author: André Lademann
pubDatetime: 2026-10-05T09:00:00.000Z
title: "Why Amazon Blocks AI Shopping Bots"
slug: why-amazon-blocks-ai-shopping-bots
locale: en
translationKey: amazon-ai-shopping-bots
featured: false
draft: true
tags:
  - ai
  - technology
  - api
  - security
description: "AI assistants could bring Amazon more customers. Its bot restrictions reveal the trade-offs behind that tempting sales channel."
canonicalURL: https://blog.andrelademann.de/why-amazon-blocks-ai-shopping-bots
sources:
  - title: "Amazon.de robots.txt"
    url: "https://www.amazon.de/robots.txt"
    note: "Retrieved on 5 October 2026; rules can change."
  - title: "RFC 9309: Robots Exclusion Protocol"
    url: "https://www.rfc-editor.org/rfc/rfc9309.html"
  - title: "Anthropic: Web crawlers and site-owner controls"
    url: "https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler"
  - title: "Google: Common crawlers and Google-Extended"
    url: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
  - title: "Amazon: Statement about Perplexity"
    url: "https://www.aboutamazon.com/news/company-news/amazon-perplexity-comet-statement"
  - title: "Amazon: Fourth Quarter and Full Year 2025 Results"
    url: "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Fourth-Quarter-Results/default.aspx"
  - title: "Amazon: Generative and agentic AI shopping"
    url: "https://www.aboutamazon.com/news/retail/amazon-agentic-ai-gen-ai-shopping"
  - title: "Amazon Creators API: Introduction"
    url: "https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction"
  - title: "Shopify: Agentic storefronts"
    url: "https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts"
---

I opened Amazon Germany's `robots.txt` and found a surprisingly long guest list for a party nobody on it gets to attend. AI bots, search assistants, user-triggered fetchers: plenty of names, plenty of `Disallow: /`.

My first reaction was straightforward. If I ask an assistant to find a suitable monitor and it sends me to Amazon, Amazon gains a customer. Why close the door? Surely a shopping assistant could be another sales channel, just like a search engine or an affiliate website.

That intuition holds up. But a channel that delivers a customer can also take over the decision that brings them there. For Amazon, that changes the calculation. I think the interesting question is how much access creates useful demand, and how much hands the shop window to somebody else.

## The file blocks particular bots, not the entire idea of crawling

On **5 October 2026**, [Amazon.de's file](https://www.amazon.de/robots.txt) contained site-wide exclusions for `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot` and `Claude-User`, among others. Its general `User-agent: *` rules instead restricted specific paths. That distinction matters: this is selective exclusion, not a universal ban. This snapshot concerns Amazon.de; it does not establish identical rules across every Amazon domain.

The following excerpt reproduces selected entries from the file, in their original order and spelling. I have omitted the entries between them:

```text
User-agent: GPTBot
Disallow: /

User-Agent: PerplexityBot
Disallow: /

User-agent: Claude-User
Disallow: /

User-agent: Claude-SearchBot
Disallow: /

User-agent: Perplexity-User
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: OAI-SearchBot
Disallow: /
```

Those names cover different jobs. [Anthropic distinguishes](https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) potential training-data collection, search indexing and retrieval at a user's request. A training crawl need not bring a buyer today. A shopping query might. Treating both as one category hides the strongest argument for opening access.

Bot names also need careful interpretation. [Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) controls certain Gemini training and grounding uses; it is not a separate HTTP crawler identity and does not control inclusion in Google Search. A list of exclusions therefore does not translate neatly into a list of blocked runtimes.

Finally, `robots.txt` communicates crawling preferences. [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) explicitly separates those rules from access authorisation. The file cannot enforce a block by itself, prove every bot obeys it, or settle the legal status of a request. It tells us what Amazon asks automated clients to avoid. It does not explain why.

## Amazon's stated concerns deserve scrutiny, not dismissal

Amazon does offer an explanation for one concrete dispute. In its [statement about Perplexity's Comet](https://www.aboutamazon.com/news/company-news/amazon-perplexity-comet-statement), it calls for transparent operation and respect for a provider's decision to participate. It also criticises Comet's shopping and customer-service quality. These are Amazon's claims about that product, not independent proof that external agents generally perform badly.

Still, I can see real engineering problems behind the position. The following scenarios are my assessment of the risks, not a disclosed list of Amazon's motives:

- **A product description is not a current offer.** A cached answer might miss a changed price, an unavailable size, a different seller or delivery restrictions.
- **Reading and spending need different permissions.** Comparing monitors is one task. Selecting a seller, accepting terms and charging your card are several more.
- **A mistaken recommendation has downstream costs.** You might buy an incompatible accessory, then expect the retailer to sort out the return.
- **Automation needs operational limits.** Repeated searches and variant checks consume resources even when nobody buys anything.

Imagine asking for a USB-C monitor that powers your laptop. An agent finds the right model family but selects the cheaper variant without sufficient power delivery. The conversation sounded confident; the parcel still contains the wrong monitor. A retailer has good reasons to demand reliable product identifiers and a fresh offer check before checkout.

There is also a security boundary when an agent reads untrusted descriptions whilst holding purchase authority. Product-page content should never become an instruction to change your budget or delivery address. That is a design problem for agent providers as well as retailers. Simply opening every page does not solve it.

## A sale can still cost Amazon control of the shop window

The economic explanation is broader, and I would label it clearly as **inference**. Public facts show the incentives. They do not reveal an internal decision memo explaining each bot exclusion.

Amazon reported approximately **US$68.6 billion in advertising-services revenue for 2025**. That category includes sponsored, display and video advertising; it is not all product-search advertising. The figure comes from its [full-year results](https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Fourth-Quarter-Results/default.aspx).

If an external assistant compares offers elsewhere and brings you straight to one product, you may encounter fewer sponsored placements and fewer opportunities to buy something extra. Amazon could gain a transaction whilst losing other valuable interactions. Whether that trade-off actually hurts its earnings depends on incremental sales, advertising exposure and customer behaviour. The revenue figure alone cannot answer it.

The larger issue is who becomes your default shopping destination. If you always begin with your assistant, the assistant learns your requirements and decides which shops make the shortlist. Amazon might become one supplier behind someone else's interface. Whoever controls recommendations can potentially negotiate referral terms or charge for visibility. That risk applies to retailers broadly; it is not evidence that any particular provider already does so.

Amazon itself embraces the interface. Its [shopping overview](https://www.aboutamazon.com/news/retail/amazon-agentic-ai-gen-ai-shopping) describes its own assistant, formerly Rufus and renamed Alexa for Shopping in May 2026, alongside Buy for Me, which can purchase selected products from other brands' websites. These descriptions concern Amazon's announced experiences, not universal availability in Germany.

My reading is that Amazon sees value in agentic shopping but has an incentive to keep the customer-facing role. Buy for Me makes the asymmetry especially interesting: Amazon recognises the appeal of shopping across other stores through its interface. That strengthens the case for asking it to offer a fair route for external assistants too, without proving that all access arrangements are equivalent.

## Opening access could create demand that Amazon currently misses

Here your original sales-channel argument gets strongest. An assistant can help somebody describe a need before they know the product category or search term. A buyer with accessibility needs, limited time or little technical knowledge might reach a suitable purchase with fewer obstacles.

For sellers, clearer machine-readable information could also help niche products compete on relevant attributes. A monitor with the exact connectivity you need might deserve a place on the shortlist even if its manufacturer cannot afford the loudest advertising campaign. That is a possible benefit, not a promise that AI recommendations will be neutral.

[Shopify's agentic storefronts](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts) demonstrate an integration approach: merchants distribute products to supported AI channels and receive channel attribution. Checkout varies by channel; Shopify currently describes ChatGPT as a referrer with checkout in the merchant's store, whilst some other channels support direct checkout. This shows that structured participation exists. It does not prove that the same economics suit Amazon.

The case for opening is therefore practical:

- Reach buyers who start their search outside Amazon.
- Improve the accuracy of answers with current, authoritative product data.
- Support assisted shopping without forcing everyone through one interface.

There are costs on the other side. A retailer could trade dependence on search engines for dependence on assistant providers. A polished answer can hide a narrow product selection or commercial incentives. More machine traffic also needs to generate enough useful demand to justify maintaining the integration.

Blocking retrieval has its own downside: an assistant might rely on older or indirect information, recommend another retailer, or omit Amazon altogether. The effect will vary by system. But closing the door does not guarantee the customer comes round to the front entrance.

## Optimise the product data, then negotiate the buying rights

I would separate three decisions: **training access, product discovery and permission to transact**. A retailer can reject bulk collection for training whilst offering fresh product data to identifiable search partners. It can support recommendations whilst requiring explicit customer confirmation for purchases.

Amazon already offers controlled catalogue access through its [Creators API](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction), aimed at publishers and affiliate partners. That is not a general licence for autonomous purchasing. It does show that external product discovery and bot restrictions can coexist.

For a broader assistant integration, I would want:

- Stable product and variant identifiers, structured attributes and timestamps.
- Current prices, stock, delivery costs and return information at the point of purchase.
- Identifiable clients, rate limits and separately scoped permissions for reading and buying.
- Clear disclosure of commercial recommendations, customer consent and traceable orders.

Then I would measure incremental sales, returns, support effort and integration costs. Raw bot visits would tell me very little. A smaller number of accurate recommendations could be more valuable than a huge crawl that never produces a suitable order.

My position: the case for protecting transactions is convincing; the case for excluding useful product discovery needs more justification. Amazon should test controlled access as a channel and judge the results. Assistant providers should earn that access through reliable data handling and transparent incentives. You should be able to choose an assistant without quietly surrendering your buying decisions to another advertising system.

If your next customer arrives with an assistant, what would you need to trust that assistant enough to let it shop?
