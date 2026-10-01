---
author: André Lademann
pubDatetime: 2026-10-01T09:00:00.000Z
title: "Make No Mistakes: What Magic Prompt Phrases Actually Do"
slug: make-no-mistakes-magic-prompt-phrases
locale: en
translationKey: make-no-mistakes-prompts
featured: false
draft: false
tags:
  - ai
description: "\"Build me a SaaS. Make no mistakes.\" If you ask an AI firmly enough, will it really try harder? I looked at where these phrases come from…"
canonicalURL: https://blog.andrelademann.de/make-no-mistakes-magic-prompt-phrases
heroImage: "/images/posts/2026/make-no-mistakes-magic-prompt-phrases/hero.gif"
ogImage: "/images/posts/2026/make-no-mistakes-magic-prompt-phrases/og.png"
sources:
  - title: "Large Language Models are Zero-Shot Reasoners (Kojima et al., 2022)"
    url: "https://arxiv.org/abs/2205.11916"
    note: "The origin of \"Let's think step by step\""
  - title: "Large Language Models as Optimizers (OPRO, Google DeepMind, 2023)"
    url: "https://arxiv.org/abs/2309.03409"
    note: "Automatically found \"Take a deep breath and work on this problem step-by-step\" for PaLM 2"
  - title: "Large Language Models Understand and Can Be Enhanced by Emotional Stimuli (EmotionPrompt, 2023)"
    url: "https://arxiv.org/abs/2307.11760"
    note: "Reported gains from phrases such as \"This is very important to my career\""
  - title: "Marc Andreessen Mocked for Accidentally Revealing That He Seems to Have a Deep Misunderstanding of How AI Actually Works (Futurism, May 2026)"
    url: "https://futurism.com/artificial-intelligence/marc-andreessen-mocked-ai-works"
    note: "A custom prompt demanding the model \"never hallucinate or make anything up\""
  - title: "Prompting Science Report 2: The Decreasing Value of Chain of Thought in Prompting (Wharton, 2025)"
    url: "https://gail.wharton.upenn.edu/research-and-insights/tech-report-chain-of-thought/"
    note: "\"Think step by step\" adds little for reasoning models, at 20–80% more response time"
  - title: "Prompting Science Report 3: I'll pay you or I'll kill you — but will you care? (Wharton, 2025)"
    url: "https://arxiv.org/abs/2508.00614"
    note: "Tips and threats show no significant aggregate effect across five models"
  - title: "TEMPER: Testing Emotional Perturbation in Quantitative Reasoning (2026)"
    url: "https://arxiv.org/abs/2604.07801"
    note: "Emotional rewording lowers maths accuracy by 2–10 percentage points across 18 models"
  - title: "Do Emotions in Prompts Matter? (2026)"
    url: "https://arxiv.org/abs/2604.02236"
    note: "Emotional prefixes usually produce only small changes in accuracy"
  - title: "Prompting best practices (Anthropic)"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
    note: "Advises dialling back aggressive language and explaining the reason behind instructions"
  - title: "GPT-5 Prompting Guide (OpenAI)"
    url: "https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide"
    note: "\"Be THOROUGH\" made GPT-5 overuse tools; reasoning depth is set via reasoning_effort"
  - title: "Prompt design strategies (Google Gemini API)"
    url: "https://ai.google.dev/gemini-api/docs/prompting-strategies"
    note: "Advises avoiding unnecessary or overly persuasive language"
  - title: "Reduce hallucinations (Anthropic)"
    url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations"
    note: "First strategy: explicitly allow the model to say \"I don't know\""
  - title: "Hallucination Leaderboard (Vectara)"
    url: "https://github.com/vectara/hallucination-leaderboard"
    note: "Hallucination rates of current models in document summarisation, as of September 2026"
  - title: "Make No Mistakes (ProgrammerHumor.io)"
    url: "https://programmerhumor.io/ai-memes/make-no-mistakes-tisl"
    note: "The vibe-coding meme in its natural habitat"
---

"Build me a SaaS for invoice management. Make no mistakes."

I keep running into that last sentence. First as a joke on X and in programmer-humour feeds, then, and this is what made me stop scrolling, in real prompts that colleagues and customers share with me. Sometimes it's "make no mistakes", sometimes "do not mess it up", "be 100% accurate" or "do not hallucinate". The intention is always the same: if I ask firmly enough, the model will try harder.

![Ant Middleton from SAS Australia looking nervous, the face of every prompt that ends in "do not mess it up" (GIF by Channel 7 via GIPHY)](https://media.giphy.com/media/oFKfrlZrZJmp4VafLn/giphy.gif)

So does it? Does a polite or stern request make an AI more careful, make it reason for longer, research more thoroughly? I went looking for where these phrases come from and what the evidence says as of autumn 2026.

## A short history of magic words

The idea that a single sentence can unlock better answers isn't superstition out of thin air. It has a genuine origin story.

In 2022, [Kojima et al.](https://arxiv.org/abs/2205.11916) showed that appending "Let's think step by step" to a maths question lifted OpenAI's text-davinci-002 from 17.7% to 78.7% accuracy on the MultiArith benchmark. That wasn't magic. The phrase made the model write out intermediate steps, and those steps became context for the final answer. The words changed **what the model produced**, not how hard it tried.

Then the folklore started. In 2023, Google DeepMind's [OPRO paper](https://arxiv.org/abs/2309.03409) let a model optimise prompts automatically, and the winner for PaLM 2 was "Take a deep breath and work on this problem step-by-step". The same year, the researchers behind [EmotionPrompt](https://arxiv.org/abs/2307.11760) reported gains from sentences such as "This is very important to my career". Not long after, people were offering chatbots cash tips.

By 2026, "make no mistakes" had become the [vibe-coding meme](https://programmerhumor.io/ai-memes/make-no-mistakes-tisl) of choice: the imaginary `--no-bugs` flag at the end of a one-line product spec. It even reached Silicon Valley's upper floors. In May 2026, Marc Andreessen shared a custom prompt that, among other things, instructed the model to "never hallucinate or make anything up", and [got thoroughly mocked for it](https://futurism.com/artificial-intelligence/marc-andreessen-mocked-ai-works).

Notice the pattern. Each phrase was measured on a specific model, on a specific benchmark, at a specific point in time. Then it escaped into the wild and turned into universal advice.

## What the evidence says in 2026

The research has caught up with the folklore, and the verdict is remarkably consistent.

- **Tips and threats:** The Wharton Generative AI Labs' [Prompting Science Report 3](https://arxiv.org/abs/2508.00614) ran five models, including GPT-4o and o4-mini, through PhD-level science questions with 25 trials per question. A trillion-dollar tip, a threat to kick a puppy, "this is important to my career": **no significant effect** in aggregate. On individual questions, though, the same variation swung accuracy by up to 36 percentage points in either direction, unpredictably.
- **Emotional pressure:** [TEMPER](https://arxiv.org/abs/2604.07801), published in April 2026 and accepted at COLM 2026, tested 18 models from 1B parameters up to frontier scale. Rewording the same maths problem in emotional language didn't help. It **lowered accuracy by 2 to 10 percentage points**. Neutralising the wording recovered most of the loss. A second study from April 2026, [Do Emotions in Prompts Matter?](https://arxiv.org/abs/2604.02236), found that emotional prefixes usually produce only small changes, a mild perturbation rather than a lever.
- **"Think step by step":** Even the one phrase that genuinely worked has lost its shine. Wharton's [report on chain of thought](https://gail.wharton.upenn.edu/research-and-insights/tech-report-chain-of-thought/) found gains of around 3% for o3-mini and o4-mini, a 3.3% drop for Gemini 2.5 Flash, and 20 to 80% more response time. Reasoning models already think; telling them to do so mostly costs you time.

To be fair, none of these studies isolates "make no mistakes" itself. But it belongs to the same family, and that family behaves like noise at best and a distraction at worst.

## Why "make no mistakes" can't work the way people hope

Think about what the sentence assumes. It assumes the model has a careless default and a careful mode, and you just haven't found the switch yet. But if a model could tell which of its outputs were mistakes, it wouldn't produce them in the first place. A hallucinated API method doesn't feel wrong to the model; it's simply the most plausible continuation available. Asking it not to hallucinate doesn't hand it the missing knowledge.

The numbers bear that out. On [Vectara's hallucination leaderboard](https://github.com/vectara/hallucination-leaderboard), updated in September 2026, even the best-ranked model, GPT-5.4, still hallucinates in 7% of document summaries. Strong frontier models sit between 9% and 12%.

The same goes for reasoning. All three major vendors now steer reasoning depth through explicit settings: `effort` at Anthropic, `reasoning_effort` at OpenAI, thinking budgets and levels at Google. If you want deeper reasoning, turn that dial rather than raising your voice. Even the dial isn't a cure-all, mind you: on the same leaderboard, GPT-5.2 hallucinated slightly more at high effort (10.8%) than at low effort (8.4%).

Raising your voice can even backfire, and all three vendors say so. Anthropic's [prompting guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) notes that recent Claude models follow the system prompt more closely than their predecessors, so instructions written in capitals now cause overreaction; it suggests replacing "CRITICAL: You MUST use this tool when…" with a plain "Use this tool when…". OpenAI's [GPT-5 guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide) describes how a "Be THOROUGH" instruction made the model call search tools over and over. And Google's [Gemini guide](https://ai.google.dev/gemini-api/docs/prompting-strategies), updated in September 2026, simply says to avoid unnecessary or overly persuasive language. Modern models listen. You don't need to shout.

Will "make no mistakes" hurt? Probably not much. Will it help? There's no evidence that it does so reliably.

## What to write instead

If "make no mistakes" is a wish, the alternative is a definition. Tell the model what a mistake **is** in your context, give it a way to check its work, and allow it to admit uncertainty. Anthropic's [guide to reducing hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) lists exactly that as its very first strategy: explicitly permit "I don't know".

Here's the difference in practice:

```text
# The wish
Build the invoice export. Make no mistakes.

# The definition
Build a CSV export for invoices in src/billing/export.ts.
- Amounts are integers in cents; never use floats.
- Dates are ISO 8601 in UTC.
- Run `npm test -- billing` and fix any failures before you finish.
- If a requirement is ambiguous or you can't verify that an API exists,
  stop and ask instead of guessing.
```

The second prompt doesn't ask for perfection. It gives the model acceptance criteria, a feedback loop and an exit. That combination is what actually reduces errors, and it's the same thing you'd give a new colleague on their first day.

One more idea from Anthropic's guide that I like a lot: explain **why**. Instead of "NEVER use ellipses", Anthropic suggests telling the model that its output will be read aloud by a text-to-speech engine that can't pronounce them. A model can generalise from a reason; from a bare rule, it can only obey. I'll admit I had a little laugh at that example, because the agent configuration for this very blog contains an ellipsis rule as well. Mine, I notice, doesn't explain why. Something to fix.

So the next time you're about to type "make no mistakes", ask yourself which mistake you're actually afraid of, and write that down instead. Which magic phrase still lives in your prompts, and have you ever tested whether it does anything at all?
