---
author: André Lademann
pubDatetime: 2026-10-20T09:00:00.000Z
title: "Was ein VW Lupo und ein Tesla Roadster gemeinsam haben: CAN-Bus"
slug: was-ein-vw-lupo-und-ein-tesla-roadster-gemeinsam-haben
locale: de
translationKey: canbus-canlab
featured: false
draft: false
tags:
  - iot
  - personal
  - automotive
description: "Ein Lupo von 1999 und ein Tesla von 2026 sprechen dieselbe Sprache. Warum der CAN-Bus nicht totzukriegen ist und wie ich ihn mit CAN-Lab lerne…"
canonicalURL: https://blog.andrelademann.de/de/posts/was-ein-vw-lupo-und-ein-tesla-roadster-gemeinsam-haben
heroImage: "/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/hero.png"
ogImage: "/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/hero.png"
sources:
  - title: "History of CAN technology (CAN in Automation)"
    url: "https://www.can-cia.org/can-knowledge/history-of-can-technology"
  - title: "CAN bus (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/CAN_bus"
  - title: "Selbststudienprogramm 218: Der LUPO 3L (Volkswagen)"
    url: "http://www.vw3literlupoclub.com/ssp218_d_Der_LUPO3L.pdf"
  - title: "opendbc: Tesla CAN definitions (comma.ai)"
    url: "https://github.com/commaai/opendbc/tree/master/opendbc/dbc"
  - title: "Tesla Roadster (second generation) (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/Tesla_Roadster_(second_generation)"
    note: "Abgerufen am 20. Oktober 2026."
  - title: "CAN-Lab"
    url: "https://canlab.andrelademann.de/"
  - title: "vergissberlin/example-canbus (GitHub)"
    url: "https://github.com/vergissberlin/example-canbus"
---

Was hat ein VW Lupo 3L von 1999 mit dem neuen Tesla Roadster gemeinsam? Nicht die Reichweite, nicht die Beschleunigung und ganz sicher nicht den Preis. Aber wenn du die Leitungen hinter dem Armaturenbrett abhören könntest, würdest du bei beiden dieselbe Sprache hören: **CAN-Bus**.

Im Lupo 3L beschreibt Volkswagens eigenes Schulungsmaterial, wie das Getriebesteuergerät über einen CAN-Datenbus mit der Dieseleinspritzung, dem ABS und dem Kombiinstrument kommuniziert. Teslas Model S und Model 3 betreiben mehrere CAN-Busse hinter einem zentralen Gateway; die Community hat sie öffentlich dokumentiert. Zur Verkabelung des Roadsters, den Tesla am 15. Oktober vorgestellt hat, gibt es noch keine Angaben. Hier extrapoliere ich also. Ich wäre aber ehrlich überrascht, wenn er mit dem Rest der Familie bräche.

Ein Protokoll, das fast 30 Jahre Fortschritt im Automobilbau überlebt, verdient einen genaueren Blick. Erst recht, wenn du es gerade in dein eigenes Auto einbauen willst.

## Ein Design aus den 80ern, das keinen Grund hat, in Rente zu gehen

CAN, kurz für Controller Area Network, entstand **1983 bei Bosch**. Im Februar 1986 stellte Bosch es auf dem SAE-Kongress in Detroit vor, 1987 lieferten Intel und Philips die ersten Controller-Chips, und ab 1991 setzte Mercedes-Benz es in seinen Oberklassefahrzeugen ein. 1993 wurde es als **ISO 11898** standardisiert. Seitdem kamen CAN FD (2012) und CAN XL dazu, aber klassisches CAN steckt nach wie vor überall.

Warum? Weil das Design die schwierigen Probleme eines Kabelbaums bemerkenswert gut löst:

- **Differenzielle Übertragung.** Zwei Leitungen, CAN_H und CAN_L, übertragen das Signal als Spannungsdifferenz. Störungen, etwa von der Zündspule, treffen beide Leitungen gleich stark und heben sich auf.
- **Kein Master.** Jeder Knoten darf senden. Beginnen zwei gleichzeitig, entscheidet die **bitweise Arbitrierung**: Der Frame mit dem niedrigsten Identifier gewinnt, der andere zieht sich zurück und versucht es erneut. Nichts geht kaputt, und niemand muss etwas koordinieren.
- **Eingebaute Fehlerbehandlung.** Jeder Frame trägt eine 15-Bit-CRC und braucht eine Bestätigung. Jeder Knoten führt Sende- und Empfangsfehlerzähler, und ein Knoten, der zu oft danebenliegt, schaltet sich selbst ab (**Bus-Off**), statt alle anderen mit herunterzuziehen.

Der letzte Punkt ist mein Favorit. Ein defekter Sensor reißt nicht das ganze Auto mit. Er verabschiedet sich still aus dem Gespräch.

## Warum ich CAN in ein Auto aus den 70ern bauen will

Vielleicht kennst du schon meinen [Peugeot 304](/posts/my-peugeot-304-vs-the-german-tuv) (Beitrag auf Englisch). Die S-Version mit Doppelvergaser kam 1972, in einer Zeit, in der „Fahrzeugelektronik“ einen Sicherungskasten und eine optimistische Grundhaltung bedeutete.

Ich will nicht ein paar Gadgets nachrüsten. Ich will die Elektrik selbst neu aufbauen: **ESP32-Boards mit Sensoren**, verteilt im ganzen Auto, die über CAN miteinander reden. Das Gehirn in der Mitte wird ein **Raspberry Pi 5**. Falls du Ähnliches vorhast: Der Pi hat keinen eigenen CAN-Controller, er braucht also ein CAN-HAT und unter Linux SocketCAN.

Bevor ich aber auch nur ein Loch in eine 50 Jahre alte Karosserie bohre, wollte ich den Bus richtig verstehen. Nicht aus einem Datenblatt, sondern auf meinem eigenen Schreibtisch.

## CAN-Lab: zwei Boards, zwei Leitungen, ein Browser-Tab

Also habe ich **[CAN-Lab](https://canlab.andrelademann.de/)** gebaut. Zugegeben nicht ganz allein, aber ich bin ziemlich stolz darauf, was am Ende dabei herausgekommen ist. Der Code ist Open Source unter GPL-3.0 auf [GitHub](https://github.com/vergissberlin/example-canbus), und das Repository enthält die fertigen Sketches.

Die Hardware ist bewusst günstig:

- 2× [**ESP32-C3 SuperMini**](https://www.amazon.de/dp/B0FKH3RLXV?tag=thebeatles-21&linkCode=ll2&linkId=05ee94507f65c830feaa4207d27dec6f)\* mit eingebautem CAN-Controller (bei Espressif heißt er TWAI)
- 2× [**SN65HVD230-Transceiver**-Boards](https://www.amazon.de/dp/B0HJW4MVBJ?tag=thebeatles-21&linkCode=ll2&linkId=f60b0d920560a96ffa2ed3e55abd2a9f)\*, 3,3 V, Terminierung meist schon auf der Platine
- GPIO 5 an CTX, GPIO 4 an CRX, dann CANH an CANH, CANL an CANL und eine gemeinsame Masse

Misst du zwischen CANH und CANL etwa 60 Ω, sind beide 120-Ω-Abschlusswiderstände vorhanden; rund 120 Ω heißt, an einem Ende fehlt einer. Den Bus auf dem ESP32 einzurichten, braucht nur ein paar Zeilen. Das ist der Kern des Sender-Sketches:

```cpp
#include "driver/twai.h"

constexpr gpio_num_t CAN_TX_PIN = GPIO_NUM_5;
constexpr gpio_num_t CAN_RX_PIN = GPIO_NUM_4;

void setup() {
  twai_general_config_t g = TWAI_GENERAL_CONFIG_DEFAULT(CAN_TX_PIN, CAN_RX_PIN, TWAI_MODE_NORMAL);
  g.tx_queue_len = 32;
  twai_timing_config_t t = TWAI_TIMING_CONFIG_500KBITS();
  twai_filter_config_t f = TWAI_FILTER_CONFIG_ACCEPT_ALL();
  twai_driver_install(&g, &t, &f);
  twai_start();
}
```

Dann steckst du beide Boards an deinen Rechner und öffnest CAN-Lab in Chrome oder Edge. Es nutzt die Web Serial API, über die ich [schon einmal geschrieben habe](/posts/lets-get-serial) (auf Englisch), es verlässt also nichts deinen Rechner. Auf der Website findest du außerdem die Schaltpläne, die ich gezeichnet habe, und ein [Steckbrett bei Wokwi](https://wokwi.com/projects/478383260674919425) als Vorlage für die Verkabelung.

Das Projekt richtet sich an IoT-Enthusiasten, die schon einmal einen ESP32 geflasht haben. Wenn dich PlatformIO und ein Steckbrett nicht abschrecken, läuft das Ganze an einem Abend.

## Lasttest für einen Bus, der älter ist als manche meiner Kollegen

Der **Verbindungstest** schickt einen Frame pro Sekunde und zeigt dir, ob Frames ankommen und ob welche fehlen. Nützlich, aber ein bisschen langweilig.

Spannend wird es beim **Lasttest**. Du wählst eine Zielrate und eine Dauer, CAN-Lab macht beide Boards scharf und zeichnet dann in Echtzeit gesendete gegen empfangene Frames auf, dazu die Fehlerzähler.

Mit meinem Aufbau habe ich **4.303 Frames pro Sekunde ohne eine einzige verlorene Nachricht** erreicht: keine Zählerlücken, keine Busfehler.

![CAN-Lab-Lasttest: Ziel 10.000 Frames pro Sekunde, 4.303 empfangen, keine Zählerlücken und keine Busfehler](/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/canlab-load-test.webp)

Ich habe bewusst 10.000 Frames pro Sekunde angeboten. Was der Bus nicht tragen konnte, hat die Sende-Warteschlange abgewiesen, und was durchkam, kam vollständig und in der richtigen Reihenfolge an. Diese Zahl hat mich aufhorchen lassen, denn sie liegt nah am physikalischen Limit. Bei 500 kbit/s braucht ein klassischer Frame mit 8 Datenbytes inklusive Pause zwischen den Frames 111 Bit, mit Bit-Stuffing bis zu 135 Bit. Daraus ergibt sich eine Obergrenze irgendwo zwischen etwa 3.700 und 4.500 Frames pro Sekunde. Anders gesagt: Zwei Boards für ein paar Euro haben die Leitung gefüllt, statt vorher schlappzumachen.

Für meinen Peugeot heißt das: Bandbreite ist meine geringste Sorge. Eine Handvoll Temperatur-, Druck- und Geschwindigkeitssensoren fällt kaum ins Gewicht.

Die vollständigen Ergebnisse, die Messmethodik und eine Schritt-für-Schritt-Bauanleitung habe ich in einem **[White Paper](/de/canlab-whitepaper/)** zusammengefasst, inklusive aller Grafiken.

## Probier es selbst aus

Besorg dir zwei ESP32-C3-Boards und zwei Transceiver, flash die Sketches aus dem Repository und starte den Lasttest. Ich bin gespannt, ob du meine 4.303 Frames pro Sekunde schlägst und was du auf den Bus legst, sobald du ihm vertraust.

_Mit \* gekennzeichnete Links sind Affiliate-Links. Als Amazon-Partner verdiene ich an qualifizierten Verkäufen. Für dich ändert sich der Preis nicht._
