---
author: André Lademann
pubDatetime: 2026-10-05T09:00:00.000Z
title: "Warum Amazon KI-Shopping-Bots aussperrt"
slug: warum-amazon-ki-shopping-bots-aussperrt
locale: de
translationKey: amazon-ai-shopping-bots
featured: false
draft: true
tags:
  - ki
  - technologie
  - api
  - security
description: "KI-Assistenten könnten Amazon neue Käufer bringen. Die Bot-Sperren zeigen, welche Interessen hinter diesem Verkaufskanal stehen."
canonicalURL: https://blog.andrelademann.de/de/posts/warum-amazon-ki-shopping-bots-aussperrt
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

Ich habe Amazons deutsche `robots.txt` geöffnet und eine erstaunlich lange Gästeliste für eine Party gefunden, zu der niemand auf der Liste kommen darf. KI-Bots, Suchassistenten, Abrufdienste für Nutzeranfragen: viele Namen, viel `Disallow: /`.

Mein erster Gedanke war ziemlich einfach. Wenn ich einen Assistenten nach einem passenden Monitor frage und er mich zu Amazon schickt, gewinnt Amazon einen Kunden. Warum die Tür zumachen? Ein Shopping-Assistent könnte doch ein weiterer Verkaufskanal sein, genau wie eine Suchmaschine oder eine Affiliate-Website.

Der Gedanke trägt. Aber ein Kanal, der einen Kunden vermittelt, kann auch die Entscheidung übernehmen, die ihn dorthin führt. Für Amazon verändert das die Rechnung. Mich interessiert deshalb, welcher Zugang zusätzliche Nachfrage schafft und welcher das Schaufenster einem anderen Unternehmen überlässt.

## Die Datei sperrt bestimmte Bots, nicht Crawling insgesamt

Am **5. Oktober 2026** enthielt [Amazons deutsche Datei](https://www.amazon.de/robots.txt) vollständige Sperren für unter anderem `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot` und `Claude-User`. Die allgemeinen Regeln unter `User-agent: *` beschränkten dagegen bestimmte Pfade. Amazon schließt also gezielt aus. Diese Momentaufnahme betrifft Amazon.de und belegt keine identischen Regeln für sämtliche Amazon-Domains.

Eine gekürzte Auswahl aus der Datei zeigt das Muster:

```text
User-agent: ClaudeBot
Disallow: /

User-agent: Claude-SearchBot
Disallow: /

User-agent: Claude-User
Disallow: /
```

Hinter diesen Namen stecken unterschiedliche Aufgaben. [Anthropic unterscheidet](https://privacy.anthropic.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) das Sammeln möglicher Trainingsdaten, Suchindexierung und Abrufe auf Nutzerwunsch. Ein Trainingscrawl bringt heute nicht zwangsläufig einen Käufer. Eine Shopping-Anfrage vielleicht schon. Wer beides zusammenwirft, übersieht das stärkste Argument für eine Öffnung.

Auch Bot-Namen brauchen eine genaue Einordnung. [Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) steuert bestimmte Trainings- und Grounding-Nutzungen für Gemini. Es bezeichnet keinen eigenen HTTP-Crawler und beeinflusst nicht die Aufnahme in die Google-Suche. Eine Liste von Sperren entspricht deshalb keiner eindeutigen Liste blockierter KI-Runtimes.

Außerdem formuliert `robots.txt` Crawling-Vorgaben. [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) grenzt diese Regeln ausdrücklich von einer Zugriffsautorisierung ab. Die Datei erzwingt selbst keine Sperre, beweist nicht die Befolgung durch jeden Bot und klärt keine Rechtsfrage. Sie zeigt, welche Zugriffe Amazon automatisierten Clients untersagen möchte. Das Warum steht dort nicht.

## Amazons erklärte Bedenken verdienen eine genaue Prüfung

Für einen konkreten Streit liefert Amazon eine Erklärung. In seiner [Stellungnahme zu Perplexitys Comet](https://www.aboutamazon.com/news/company-news/amazon-perplexity-comet-statement) fordert das Unternehmen transparentes Verhalten und die Achtung seiner Entscheidung über die Teilnahme. Außerdem kritisiert Amazon Comets Einkaufs- und Kundenservicequalität. Das sind Amazons Aussagen über dieses Produkt, keine unabhängigen Belege dafür, dass externe Agenten generell schlecht arbeiten.

Trotzdem erkenne ich dahinter echte technische Probleme. Die folgenden Szenarien beschreiben meine Risikobewertung; Amazon hat sie nicht als vollständige Motivliste für seine Sperren veröffentlicht:

- **Eine Produktbeschreibung ist kein aktuelles Angebot.** Eine gespeicherte Antwort kann einen geänderten Preis, eine ausverkaufte Größe, einen anderen Verkäufer oder Lieferbeschränkungen übersehen.
- **Lesen und Geldausgeben brauchen unterschiedliche Rechte.** Monitore vergleichen ist eine Aufgabe. Einen Verkäufer auswählen, Bedingungen akzeptieren und deine Karte belasten sind mehrere weitere.
- **Eine falsche Empfehlung verursacht Folgekosten.** Du bestellst vielleicht inkompatibles Zubehör und erwartest anschließend, dass der Händler die Rückgabe regelt.
- **Automatisierung braucht betriebliche Grenzen.** Wiederholte Suchen und Variantenprüfungen verbrauchen Ressourcen, selbst wenn niemand etwas bestellt.

Stell dir vor, du suchst einen USB-C-Monitor, der deinen Laptop mit Strom versorgt. Der Agent findet die richtige Modellfamilie, wählt aber die günstigere Variante mit zu wenig Ladeleistung. Das Gespräch klang überzeugend; im Paket liegt trotzdem der falsche Monitor. Ein Händler hat gute Gründe, eindeutige Produktkennungen und eine aktuelle Angebotsprüfung vor dem Kauf zu verlangen.

Eine Sicherheitsgrenze entsteht auch dann, wenn ein Agent unvertrauenswürdige Produkttexte liest und gleichzeitig Kaufrechte besitzt. Inhalte einer Produktseite dürfen ihm keine Anweisungen geben, dein Budget oder deine Lieferadresse zu ändern. Dieses Problem müssen Agentenanbieter und Händler gemeinsam lösen. Einfach jede Seite freizugeben reicht dafür nicht.

## Ein Verkauf kann Amazon trotzdem die Kontrolle über das Schaufenster kosten

Die wirtschaftliche Erklärung geht weiter, und ich kennzeichne sie ausdrücklich als **Interpretation**. Öffentliche Fakten zeigen die Anreize. Sie liefern kein internes Entscheidungspapier, das jede einzelne Bot-Sperre begründet.

Amazon meldete für 2025 rund **68,6 Milliarden US-Dollar Umsatz mit Werbedienstleistungen**. Diese Kategorie umfasst gesponserte Anzeigen, Display- und Videowerbung; sie besteht nicht ausschließlich aus Werbung in der Produktsuche. Die Zahl stammt aus den [Jahresergebnissen](https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-Fourth-Quarter-Results/default.aspx).

Vergleicht ein externer Assistent Angebote anderswo und führt dich direkt zu einem Produkt, begegnest du möglicherweise weniger gesponserten Platzierungen und weniger Zusatzangeboten. Amazon könnte eine Transaktion gewinnen und andere wertvolle Kontakte verlieren. Ob sich das tatsächlich negativ auswirkt, hängt von zusätzlichen Verkäufen, Werbekontakten und Kundenverhalten ab. Die Umsatzhöhe allein beantwortet das nicht.

Die größere Frage lautet, wo dein Einkauf beginnt. Startest du immer beim Assistenten, lernt dieser deine Anforderungen und entscheidet, welche Shops überhaupt in die engere Auswahl kommen. Amazon könnte zu einem Lieferanten hinter einer fremden Oberfläche werden. Wer Empfehlungen kontrolliert, könnte Vermittlungsbedingungen aushandeln oder Geld für Sichtbarkeit verlangen. Dieses Risiko betrifft Händler allgemein; es belegt kein entsprechendes Verhalten eines bestimmten Anbieters.

Amazon setzt selbst auf diese Oberfläche. Seine [Shopping-Übersicht](https://www.aboutamazon.com/news/retail/amazon-agentic-ai-gen-ai-shopping) beschreibt den eigenen Assistenten, früher Rufus und seit Mai 2026 Alexa for Shopping, sowie Buy for Me für ausgewählte Käufe auf anderen Marken-Websites. Das beschreibt Amazons angekündigte Angebote, keine flächendeckende Verfügbarkeit in Deutschland.

Meine Lesart: Amazon erkennt den Wert agentengestützten Einkaufens und hat einen Anreiz, die Schnittstelle zum Kunden selbst zu betreiben. Buy for Me macht diese Asymmetrie besonders interessant. Amazon sieht den Nutzen darin, über die eigene Oberfläche in anderen Shops einzukaufen. Das stärkt die Forderung nach einem fairen Zugang für externe Assistenten, beweist aber nicht, dass sämtliche Zugriffsvereinbarungen gleichwertig sind.

## Eine Öffnung könnte Nachfrage schaffen, die Amazon heute verpasst

Hier überzeugt mich dein ursprüngliches Verkaufskanal-Argument am meisten. Ein Assistent kann Menschen helfen, einen Bedarf zu formulieren, bevor sie die Produktkategorie oder den passenden Suchbegriff kennen. Wer Barrieren beim Einkaufen erlebt, wenig Zeit oder wenig technisches Wissen hat, könnte leichter zu einem passenden Kauf gelangen.

Für Verkäufer könnten klar strukturierte Produktdaten außerdem Nischenprodukte sichtbarer machen. Ein Monitor mit genau deinen benötigten Anschlüssen verdient vielleicht einen Platz in der Auswahl, auch wenn sein Hersteller nicht die lauteste Werbekampagne bezahlen kann. Das ist eine mögliche Chance, kein Versprechen neutraler KI-Empfehlungen.

[Shopifys Agentic Storefronts](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts) zeigen einen Integrationsweg: Händler liefern Produkte an unterstützte KI-Kanäle und erhalten eine Kanalzuordnung. Der Kaufabschluss unterscheidet sich je nach Kanal. Shopify beschreibt ChatGPT derzeit als Vermittler mit Checkout im Händler-Shop; einige andere Kanäle unterstützen einen direkten Checkout. Strukturierte Teilnahme existiert also. Das beweist noch nicht, dass dieselbe Rechnung für Amazon aufgeht.

Die praktischen Argumente für eine Öffnung:

- Käufer erreichen, die ihre Suche außerhalb von Amazon beginnen.
- Antworten durch aktuelle Produktdaten aus erster Hand präziser machen.
- Assistiertes Einkaufen ermöglichen, ohne alle durch dieselbe Oberfläche zu schicken.

Auf der anderen Seite stehen neue Abhängigkeiten. Ein Händler könnte die Abhängigkeit von Suchmaschinen gegen die von Assistentenanbietern tauschen. Eine elegant formulierte Antwort kann eine eingeschränkte Produktauswahl oder kommerzielle Interessen verdecken. Zusätzlicher Maschinenverkehr muss außerdem genug sinnvolle Nachfrage erzeugen, um die Pflege der Integration zu rechtfertigen.

Auch gesperrte Abrufe haben Nachteile: Ein Assistent greift vielleicht auf ältere oder indirekte Informationen zurück, empfiehlt einen anderen Händler oder lässt Amazon ganz weg. Der Effekt hängt vom jeweiligen System ab. Eine geschlossene Tür garantiert jedenfalls nicht, dass der Kunde anschließend den Haupteingang nimmt.

## Produktdaten optimieren, Kaufrechte gezielt vereinbaren

Ich würde drei Entscheidungen trennen: **Trainingszugang, Produktsuche und Kaufberechtigung**. Ein Händler kann massenhaftes Sammeln für Trainingszwecke ablehnen und identifizierbaren Suchpartnern trotzdem frische Produktdaten liefern. Er kann Empfehlungen unterstützen und vor einem Kauf eine ausdrückliche Kundenbestätigung verlangen.

Amazon bietet mit der [Creators API](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction) bereits kontrollierten Katalogzugang für Publisher und Affiliate-Partner. Das ist keine allgemeine Erlaubnis für autonome Käufe. Es zeigt aber, dass externe Produktsuche und Bot-Sperren nebeneinander funktionieren können.

Für eine breitere Assistentenintegration würde ich Folgendes erwarten:

- Stabile Produkt- und Variantenkennungen, strukturierte Merkmale und Zeitstempel.
- Aktuelle Preise, Bestände, Lieferkosten und Rückgabeinformationen zum Kaufzeitpunkt.
- Identifizierbare Clients, Abruflimits und getrennte Berechtigungen zum Lesen und Kaufen.
- Transparente kommerzielle Empfehlungen, Kundeneinwilligung und nachvollziehbare Bestellungen.

Anschliessend würde ich zusätzliche Verkäufe, Retouren, Supportaufwand und Integrationskosten messen. Die bloße Anzahl von Bot-Besuchen sagt mir wenig. Wenige korrekte Empfehlungen können wertvoller sein als ein riesiger Crawl, der nie zu einer passenden Bestellung führt.

Meine Position: Der Schutz von Transaktionen überzeugt mich; der Ausschluss hilfreicher Produktsuche braucht mehr Begründung. Amazon sollte kontrollierten Zugang als Verkaufskanal testen und die Ergebnisse bewerten. Assistentenanbieter sollten sich diesen Zugang durch zuverlässigen Umgang mit Daten und transparente Interessen verdienen. Du solltest deinen Assistenten wählen können, ohne deine Kaufentscheidungen stillschweigend einem weiteren Werbesystem zu überlassen.

Wenn dein nächster Kunde einen Assistenten mitbringt: Was brauchst du, um diesem Assistenten den Einkauf anzuvertrauen?
