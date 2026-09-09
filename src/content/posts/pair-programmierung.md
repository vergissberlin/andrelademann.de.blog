---
author: André Lademann
pubDatetime: 2021-07-28T08:44:12.000Z
title: "Pair Programming"
slug: pair-programmierung
locale: de
translationKey: pair-programming
featured: false
draft: false
tags:
  - zusammenarbeit
ogImage: "/images/posts/pair-programming/hero.jpeg"
description: "Beim Pair Programming arbeiten zwei Entwickler gleichzeitig an demselben Quellcode. Die Methode hilft dabei, bessere Softwareprodukte zu entwickeln."
---

Beim Pair Programming arbeiten zwei Entwickler gleichzeitig an demselben Quellcode. Die Methode hilft dabei, bessere Softwareprodukte zu entwickeln.

## Vorteile

Bei Netresearch nutzen wir diese Methode und leiten daraus viele Vorteile ab:

- direkter Wissensaustausch über Methoden, eingesetzte Werkzeuge und Arbeitsweisen;
- bessere Codequalität durch direktes Code-Review und dadurch robusteren Code;
- bessere Zusammenarbeit durch Kommunikation;
- beim verbalen Beschreiben von Ansätzen entstehen neue Ideen und Denkfehler werden sichtbar;
- im Dialog lässt sich die beste Lösung finden;
- ein gemeinsames Erfolgserlebnis macht zufriedener mit dem Ergebnis.

## Ein verbreitetes Vorurteil

Kurzfristig könnte man denken, dass ein Feature doppelt so viel Entwicklungszeit benötigt. Tatsächlich führen **der Wegfall eines Code-Reviews, der Wissensaustausch und der robustere Code langfristig nicht zu zusätzlichen Kosten**.

## Nachteile

Da ist dieses starke Gefühl, unbedingt an die Tastatur zu wollen, weil du dein Problem einfach nicht so beschreiben kannst, dass dein Co-Pilot es versteht. Das kann Jahre deines Lebens kosten und zu grauen Haaren führen. Ausserdem können deine Fingernägel brechen, wenn du zu fest in das Sitzkissen deines Bürostuhls greifst.

## Regeln

Du und deine Führungskraft seid überzeugt und fragt euch, wie ihr anfangen sollt? Für Pair Programming gibt es einige Regeln:

1. Wechselt die Tastatur mindestens alle 15 Minuten. So bleiben beide Programmierenden die ganze Zeit im Thema.
2. Beim Schreiben von Code wird gesprochen.
3. Du musst dich kneifen, um zu sagen: „Ich mache das schnell.“
4. Pair Programming ist kein Muss. Bei Routineaufgaben lässt sich manchmal kein Wissen teilen.
5. Räumt euren Schreibtisch auf, damit ihr vorbereitet seid, nicht allein zu sein.
6. Wenn ihr euch im echten Leben trefft, duscht morgens.

## Pair Programming aus der Ferne

Zusammen an einem Computer zu sitzen, ist wahrscheinlich das Schönste überhaupt. Beim Pair Programming sind vermutlich viele Stockfotos entstanden, auf denen eine Person lächelt und auf den Bildschirm zeigt. Etwas Albernes [wie dieses](https://www.netresearch.de/blog/webseiten-bauen-im-schuelerpraktikum-bei-netresearch/) … oder [dieses](https://www.netresearch.de/blog/schuelerpraktikum-bei-netresearch/).

Aber wie funktioniert Pair Programming, wenn die Arbeitsplätze kilometerweit voneinander entfernt sind? Es gibt einige Techniken, zum Beispiel [Git Handover](https://www.remotemobprogramming.org/). Heute möchte ich jedoch **Code With Me** von JetBrains vorstellen.

![JetBrains-IDE während einer Code-With-Me-Pair-Programming-Session mit geöffnetem docker-compose.yml und Videochat](/images/posts/pair-programming/img-1.png)

Eines Tages habe ich tatsächlich einen der Tipps gelesen, die beim Öffnen von _Android Studio_, _WebStorm_, _PHPStorm_, _RubyMine_, _PyCharm_, _GoLand_, _CLion_ oder einer anderen IntelliJ-IDE-Variante erscheinen, und diese Funktion entdeckt. Es gibt bereits mehrere Editoren, mit denen man gemeinsam an einer Datei arbeiten kann. Mit _Code With Me_ hat JetBrains aus Tschechien das Ganze aber auf ein neues Level gehoben.

1. Einladungen zu einer Pair-Programming-Session per Link;
2. Kontrolle der Zugriffsrechte;
3. integrierter Audio- und Videochat;
4. ein Follow-up-Modus, in dem man verfolgen kann, wenn die andere Person eine neue Datei öffnet oder scrollt.

Du startest eine Pair-Programming-Session, indem du oben rechts auf das Benutzersymbol klickst.

![Code-With-Me-Menü in einer JetBrains-IDE mit hervorgehobenen Optionen für Zugriff aktivieren und Einladungslink kopieren](/images/posts/pair-programming/img-2.png)

---

## Zusammenfassung

Ich möchte das Vorurteil nicht wiederholen, aber du solltest es kennen, falls deine Projektleitung mit den folgenden Argumenten dagegenhält. Das Vorurteil „Ein Problem plus zwei Programmierende ergibt den doppelten Aufwand“ ist falsch. Du verbesserst die Codequalität, was zumindest weniger Fehler bedeutet. Du teilst Wissen und verbesserst deine Kommunikationsfähigkeiten.

## Fragen

Hast du schon einmal regelmässig Pair Programming oder sogar Mob Programming ausprobiert? Welche Erfahrungen hast du damit gemacht? Wie haben deine Führungskräfte reagiert?
