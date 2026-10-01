---
author: André Lademann
pubDatetime: 2026-10-01T09:00:00.000Z
title: "Make no mistakes: Was magische Prompt-Formeln wirklich bewirken"
slug: make-no-mistakes-magische-prompt-formeln
locale: de
translationKey: make-no-mistakes-prompts
featured: false
draft: true
tags:
  - ki
description: "„Bau mir ein SaaS. Make no mistakes.“ Strengt sich eine KI wirklich mehr an, wenn man sie nur nachdrücklich genug bittet? Ich habe nachgesehen…"
canonicalURL: https://blog.andrelademann.de/de/posts/make-no-mistakes-magische-prompt-formeln
sources:
  - title: "Large Language Models are Zero-Shot Reasoners (Kojima et al., 2022)"
    url: "https://arxiv.org/abs/2205.11916"
    note: "Der Ursprung von „Let's think step by step“"
  - title: "Large Language Models as Optimizers (OPRO, Google DeepMind, 2023)"
    url: "https://arxiv.org/abs/2309.03409"
    note: "Fand automatisch „Take a deep breath and work on this problem step-by-step“ für PaLM 2"
  - title: "Large Language Models Understand and Can Be Enhanced by Emotional Stimuli (EmotionPrompt, 2023)"
    url: "https://arxiv.org/abs/2307.11760"
    note: "Berichtete Verbesserungen durch Sätze wie „This is very important to my career“"
  - title: "Prompting Science Report 3: I'll pay you or I'll kill you — but will you care?"
    url: "https://arxiv.org/abs/2508.00614"
    note: "Wharton-Studie: Trinkgeld und Drohungen zeigen über fünf Modelle hinweg keinen signifikanten Gesamteffekt"
  - title: "Prompting best practices (Anthropic)"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
    note: "Empfiehlt, aggressive Formulierungen zurückzunehmen und Anweisungen zu begründen"
  - title: "Reduce hallucinations (Anthropic)"
    url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations"
    note: "Erste Strategie: dem Modell ausdrücklich erlauben, „Ich weiß es nicht“ zu sagen"
  - title: "Make No Mistakes (ProgrammerHumor.io)"
    url: "https://programmerhumor.io/ai-memes/make-no-mistakes-tisl"
    note: "Das Vibe-Coding-Meme in seinem natürlichen Lebensraum"
---

„Bau mir ein SaaS für Rechnungsverwaltung. Make no mistakes.“

Diesen letzten Satz lese ich immer wieder. Zuerst als Witz auf X und in Programmer-Humor-Feeds, dann, und da bin ich hängen geblieben, in echten Prompts, die mir Kolleginnen, Kollegen und Kunden zeigen. Mal heißt es „make no mistakes“, mal „sei zu 100 % korrekt“ oder „halluziniere nicht“. Die Absicht ist immer dieselbe: Wenn ich nur nachdrücklich genug frage, strengt sich das Modell mehr an.

Stimmt das? Wird eine KI durch eine höfliche oder strenge Bitte sorgfältiger, denkt sie länger nach, recherchiert sie gründlicher? Ich habe mir angesehen, woher diese Formeln kommen und was die Forschung tatsächlich dazu sagt.

## Eine kurze Geschichte der Zauberworte

Die Idee, dass ein einzelner Satz bessere Antworten freischaltet, ist kein Aberglaube aus dem Nichts. Sie hat einen echten Ursprung.

2022 zeigten [Kojima et al.](https://arxiv.org/abs/2205.11916), dass der Zusatz „Let's think step by step“ unter einer Matheaufgabe OpenAIs text-davinci-002 im MultiArith-Benchmark von 17,7 % auf 78,7 % Genauigkeit hob. Magie war das nicht. Der Satz brachte das Modell dazu, Zwischenschritte auszuschreiben, und diese Schritte wurden zum Kontext für die finale Antwort. Die Worte veränderten, **was das Modell erzeugte**, nicht, wie sehr es sich anstrengte.

Danach begann die Folklore. 2023 ließ Google DeepMind im [OPRO-Paper](https://arxiv.org/abs/2309.03409) ein Modell automatisch Prompts optimieren, und der Gewinner für PaLM 2 lautete „Take a deep breath and work on this problem step-by-step“. Im selben Jahr berichteten die Forschenden hinter [EmotionPrompt](https://arxiv.org/abs/2307.11760) von Verbesserungen durch Sätze wie „This is very important to my career“. Kurz darauf boten Leute ihren Chatbots Trinkgeld an. Und 2026 war „make no mistakes“ das [Vibe-Coding-Meme](https://programmerhumor.io/ai-memes/make-no-mistakes-tisl) schlechthin: das imaginäre `--no-bugs`-Flag am Ende einer einzeiligen Produktspezifikation.

Das Muster ist auffällig. Jede dieser Formeln wurde an einem bestimmten Modell, mit einem bestimmten Benchmark, zu einem bestimmten Zeitpunkt gemessen. Dann ist sie entkommen und zum allgemeingültigen Ratschlag geworden.

## Was die Forschung heute sagt

2025 haben die Wharton Generative AI Labs die Folklore ordentlich überprüft. Ihr [Prompting Science Report 3](https://arxiv.org/abs/2508.00614) schickte fünf Modelle, darunter GPT-4o, o4-mini und zwei Gemini-Flash-Versionen, durch Wissenschaftsfragen auf Promotionsniveau (GPQA Diamond) und MMLU-Pro, mit 25 Durchläufen pro Frage. Getestet wurden ein Trinkgeld von tausend Dollar, eines von einer Billion Dollar, die Drohung, einen Welpen zu treten, die Drohung, das Modell bei der Personalabteilung zu melden, und der Klassiker „das ist wichtig für meine Karriere“.

Das Ergebnis: **kein signifikanter Effekt**, über alle Modelle hinweg. Trinkgeld und Drohungen veränderten die Benchmark-Leistung insgesamt nicht. Beunruhigender war etwas anderes. Bei einzelnen Fragen konnte dieselbe Variation die Genauigkeit um mehr als 30 Prozentpunkte in die eine oder andere Richtung verschieben, und niemand konnte vorhersagen, in welche.

Fairerweise: „Make no mistakes“ selbst wurde in der Studie nicht getestet. Die Formel gehört aber zur selben Familie, und diese Familie verhält sich wie Rauschen, nicht wie ein Regler.

## Warum „make no mistakes“ nicht so funktionieren kann, wie man hofft

Überlege einmal, was der Satz voraussetzt. Er geht davon aus, dass das Modell einen schludrigen Standardmodus und einen sorgfältigen Modus hat und man nur den Schalter noch nicht gefunden hat. Könnte ein Modell aber erkennen, welche seiner Ausgaben Fehler sind, würde es sie gar nicht erst erzeugen. Eine halluzinierte API-Methode fühlt sich für das Modell nicht falsch an; sie ist schlicht die plausibelste Fortsetzung, die es gerade hat. Die Bitte, nicht zu halluzinieren, liefert ihm das fehlende Wissen nicht nach.

Beim Reasoning ist es ähnlich. Bei heutigen Reasoning-Modellen wird die Denkdauer vor allem über explizite Einstellungen gesteuert, etwa ein Thinking-Budget oder ein Effort-Level, die du in der API oder in deinem Tool festlegst. Wer gründlicheres Nachdenken will, dreht an diesem Regler. Lauter werden hilft nicht.

Lauter werden kann sogar schaden. Anthropics eigener [Prompting-Leitfaden](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) weist darauf hin, dass neuere Claude-Modelle dem System-Prompt genauer folgen als ihre Vorgänger. Anweisungen in Großbuchstaben, die einst alte Schwächen ausgleichen sollten, führen deshalb heute zu Überreaktionen. Die Empfehlung: „CRITICAL: You MUST use this tool when…“ durch ein schlichtes „Use this tool when…“ ersetzen. Moderne Modelle hören zu. Anschreien ist nicht nötig.

Schadet „make no mistakes“? Vermutlich kaum. Hilft es? Dafür, dass es das zuverlässig tut, gibt es keinen Beleg.

## Was du stattdessen schreiben solltest

Wenn „make no mistakes“ ein Wunsch ist, dann ist die Alternative eine Definition. Sag dem Modell, was in deinem Kontext ein Fehler **ist**, gib ihm eine Möglichkeit, seine Arbeit zu prüfen, und erlaube ihm, Unsicherheit zuzugeben. Anthropics [Leitfaden zur Reduzierung von Halluzinationen](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) nennt genau das als allererste Strategie: dem Modell ausdrücklich „Ich weiß es nicht“ erlauben.

So sieht der Unterschied in der Praxis aus:

```text
# Der Wunsch
Bau den Rechnungsexport. Mach keine Fehler.

# Die Definition
Bau einen CSV-Export für Rechnungen in src/billing/export.ts.
- Beträge sind Ganzzahlen in Cent; verwende niemals Floats.
- Datumsangaben sind ISO 8601 in UTC.
- Führe `npm test -- billing` aus und behebe alle Fehler, bevor du fertig bist.
- Wenn eine Anforderung mehrdeutig ist oder du nicht prüfen kannst,
  ob eine API existiert, halte an und frag nach, statt zu raten.
```

Der zweite Prompt verlangt keine Perfektion. Er gibt dem Modell Akzeptanzkriterien, eine Feedbackschleife und einen Notausgang. Genau diese Kombination reduziert Fehler tatsächlich, und es ist dasselbe, was du einer neuen Kollegin oder einem neuen Kollegen am ersten Tag mitgeben würdest.

Noch eine Idee aus demselben Leitfaden, die mir sehr gefällt: Erkläre das **Warum**. Statt „NEVER use ellipses“ schlägt Anthropic vor, dem Modell zu sagen, dass seine Ausgabe von einer Text-to-Speech-Engine vorgelesen wird, die Auslassungspunkte nicht aussprechen kann. Aus einer Begründung kann ein Modell verallgemeinern; einer nackten Regel kann es nur gehorchen. Ich musste bei dem Beispiel kurz schmunzeln, denn die Agent-Konfiguration genau dieses Blogs enthält ebenfalls eine Regel zu Auslassungspunkten. Meine erklärt, wie mir gerade auffällt, nicht, warum. Steht jetzt auf der Liste.

Wenn du also das nächste Mal „make no mistakes“ tippen willst, frag dich, vor welchem Fehler du eigentlich Angst hast, und schreib genau das hin. Welche Zauberformel steckt noch in deinen Prompts, und hast du je getestet, ob sie überhaupt etwas bewirkt?
