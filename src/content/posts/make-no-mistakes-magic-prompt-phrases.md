---
author: André Lademann
pubDatetime: 2026-10-01T09:00:00.000Z
title: "Make No Mistakes: What Magic Prompt Phrases Actually Do"
slug: make-no-mistakes-magic-prompt-phrases
locale: en
translationKey: make-no-mistakes-prompts
featured: false
draft: true
tags:
  - ai
description: "\"Build me a SaaS. Make no mistakes.\" If you ask an AI firmly enough, will it really try harder? I looked at where these phrases come from…"
canonicalURL: https://blog.andrelademann.de/make-no-mistakes-magic-prompt-phrases
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
  - title: "Prompting Science Report 3: I'll pay you or I'll kill you — but will you care?"
    url: "https://arxiv.org/abs/2508.00614"
    note: "Wharton study: tips and threats show no significant aggregate effect across five models"
  - title: "Prompting best practices (Anthropic)"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
    note: "Advises dialling back aggressive language and explaining the reason behind instructions"
  - title: "Reduce hallucinations (Anthropic)"
    url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations"
    note: "First strategy: explicitly allow the model to say \"I don't know\""
  - title: "Make No Mistakes (ProgrammerHumor.io)"
    url: "https://programmerhumor.io/ai-memes/make-no-mistakes-tisl"
    note: "The vibe-coding meme in its natural habitat"
---

"Build me a SaaS for invoice management. Make no mistakes."

I keep running into that last sentence. First as a joke on X and in programmer-humour feeds, then, and this is what made me stop scrolling, in real prompts that colleagues and customers share with me. Sometimes it's "make no mistakes", sometimes "be 100% accurate" or "do not hallucinate". The intention is always the same: if I ask firmly enough, the model will try harder.

So does it? Does a polite or stern request make an AI more careful, make it reason for longer, research more thoroughly? I went looking for where these phrases come from and what the evidence actually says.

## A short history of magic words

The idea that a single sentence can unlock better answers isn't superstition out of thin air. It has a genuine origin story.

In 2022, [Kojima et al.](https://arxiv.org/abs/2205.11916) showed that appending "Let's think step by step" to a maths question lifted OpenAI's text-davinci-002 from 17.7% to 78.7% accuracy on the MultiArith benchmark. That wasn't magic. The phrase made the model write out intermediate steps, and those steps became context for the final answer. The words changed **what the model produced**, not how hard it tried.

Then the folklore started. In 2023, Google DeepMind's [OPRO paper](https://arxiv.org/abs/2309.03409) let a model optimise prompts automatically, and the winner for PaLM 2 was "Take a deep breath and work on this problem step-by-step". The same year, the researchers behind [EmotionPrompt](https://arxiv.org/abs/2307.11760) reported gains from sentences such as "This is very important to my career". Not long after, people were offering chatbots cash tips. And by 2026, "make no mistakes" had become the [vibe-coding meme](https://programmerhumor.io/ai-memes/make-no-mistakes-tisl) of choice: the imaginary `--no-bugs` flag at the end of a one-line product spec.

Notice the pattern. Each phrase was measured on a specific model, on a specific benchmark, at a specific point in time. Then it escaped into the wild and turned into universal advice.

## What the evidence says today

In 2025, the Wharton Generative AI Labs put the folklore to a proper test. Their [Prompting Science Report 3](https://arxiv.org/abs/2508.00614) ran five models, including GPT-4o, o4-mini and two Gemini Flash versions, through PhD-level science questions (GPQA Diamond) and MMLU-Pro, with 25 trials per question. They tried a thousand-dollar tip, a trillion-dollar tip, a threat to kick a puppy, a threat to report the model to HR, and the classic "this is important to my career".

The result: across the board, **no significant effect**. Tips and threats didn't move benchmark performance in aggregate. What did happen was more unsettling. On individual questions, the same variation could swing accuracy by more than 30 percentage points in either direction, and nobody could predict which way it would go.

To be fair, the study didn't test "make no mistakes" itself. But it belongs to the same family, and that family behaves like noise, not like a dial.

## Why "make no mistakes" can't work the way people hope

Think about what the sentence assumes. It assumes the model has a careless default and a careful mode, and you just haven't found the switch yet. But if a model could tell which of its outputs were mistakes, it wouldn't produce them in the first place. A hallucinated API method doesn't feel wrong to the model; it's simply the most plausible continuation available. Asking it not to hallucinate doesn't hand it the missing knowledge.

The same goes for reasoning. On today's reasoning models, how long the model thinks is primarily governed by explicit settings, such as a thinking budget or an effort level, that you configure in the API or your tool. If you want deeper reasoning, turn that dial. Don't raise your voice.

Raising your voice can even backfire. Anthropic's own [prompting guide](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) notes that recent Claude models follow the system prompt more closely than their predecessors, so instructions written in capitals to fight old weaknesses now cause overreaction. Their advice is to replace "CRITICAL: You MUST use this tool when…" with a plain "Use this tool when…". Modern models listen. You don't need to shout.

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

One more idea from the same guide that I like a lot: explain **why**. Instead of "NEVER use ellipses", Anthropic suggests telling the model that its output will be read aloud by a text-to-speech engine that can't pronounce them. A model can generalise from a reason; from a bare rule, it can only obey. I'll admit I had a little laugh at that example, because the agent configuration for this very blog contains an ellipsis rule as well. Mine, I notice, doesn't explain why. Something to fix.

So the next time you're about to type "make no mistakes", ask yourself which mistake you're actually afraid of, and write that down instead. Which magic phrase still lives in your prompts, and have you ever tested whether it does anything at all?
