---
author: André Lademann
pubDatetime: 2022-10-25T00:00:00.000Z
title: "git rebase theirs - Probleme beim Rebase beheben"
slug: git-rebase-theirs-probleme-beim-rebase-beheben
featured: false
draft: true
tags:
  - git
description: "Wie man mit git rebase -Xtheirs und -Xours Merge-Konflikte beim Rebase automatisch auflöst."
---

Ich befinde mich oft in einer Situation, in der ich meinen lokalen Funktionszweig mit dem Master abgleichen muss, aber wenn ich `git rebase master` ausführe, entstehen eine Reihe von Konflikten — obwohl ich weiß, dass mein lokaler Funktionszweig das Neueste enthält und ich einfach möchte, dass die Änderungen in meinem Funktionszweig die entsprechenden Dateien im Master überschreiben.

Seit der Git-Version 1.7.3 ist es möglich, dem Befehl `git rebase` eine Strategieoption zu übergeben.

Die Verwendung von `-Xtheirs` und `-Xours` scheint etwas kontraintuitiv zu sein. Stellen Sie sich vor, dass Sie damit git mitteilen, welchen Zweigcode es bei der Lösung von Rebase-Konflikten bevorzugen soll:

```bash
# den aktuellen Zweig sehen
$ git branch
* branch-a

# rebase bevorzugt den aktuellen Zweig bei Konflikten
$ git rebase -Xtheirs branch-b
```

`-Xtheirs` bevorzugt beim Überschreiben von Merge-Konflikten den Code aus dem aktuellen Zweig (`branch-a`), und umgekehrt überschreibt `-Xours` Merge-Konflikte mit dem Code in `branch-b`.

Ähnliche Optionen gibt es auch im Befehl `git merge`, aber die Bedeutung von `-Xtheirs` und `-Xours` ist aufgrund der Unterschiede in der Arbeitsweise von `git rebase` und `git merge` umgekehrt:

```bash
$ git rebase -Xtheirs branch-b  # <- unsere: branch-b, ihre: branch-a
$ git merge  -Xtheirs branch-b  # <- unsere: branch-a, ihre: branch-b
```

Wenn du also Änderungen von `origin/master` zusammenführst und möchtest, dass git bei Konflikten deinen aktuellen Zweig bevorzugt:

```bash
$ git merge -Xours origin/master
```
