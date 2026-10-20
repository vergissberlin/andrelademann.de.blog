---
locale: de
title: "White Paper: CAN-Bus-Lasttest mit zwei ESP32-C3"
description: "Testergebnisse, Messmethodik und Bauanleitung für CAN-Lab: 4.303 Frames pro Sekunde bei 500 kbit/s, ohne Zählerlücken und ohne Busfehler."
ogImage: /images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/canlab-og.jpg
canonicalURL: https://blog.andrelademann.de/de/canlab-whitepaper
---

André Lademann · Oktober 2026 · Version 1.0

> [!note] Hinweis zu Affiliate-Links
> Mit \* gekennzeichnete Links sind Affiliate-Links. Als Amazon-Partner verdiene ich an qualifizierten Verkäufen. Für dich ändert sich der Preis nicht.

## Kurzfassung

Zwei ESP32-C3-Boards mit SN65HVD230-Transceivern übertragen bei 500 kbit/s stabil **4.303 CAN-Frames pro Sekunde** mit je 8 Datenbytes. Im Messzeitraum traten **keine Zählerlücken, keine Überläufe der Empfangswarteschlange und keine Busfehler** auf. Rechnerisch belegt jeder Frame dabei rund 116 Bitzeiten. Der Bus war damit praktisch vollständig ausgelastet: Begrenzt hat die Leitung, nicht die Hardware.

Dieses Dokument beschreibt den Aufbau, die Messmethodik, die Ergebnisse und ihre Grenzen. Am Ende steht eine Schritt-für-Schritt-Anleitung, mit der du den Test selbst nachbauen kannst. Der Hintergrund steht im Blogartikel [Was ein VW Lupo und ein Tesla Roadster gemeinsam haben](/de/posts/was-ein-vw-lupo-und-ein-tesla-roadster-gemeinsam-haben/).

## Motivation

Ich baue die Elektrik meines Peugeot 304 S neu auf: verteilte ESP32-Knoten mit Sensoren, die über CAN kommunizieren, und ein Raspberry Pi 5 als zentrale Recheneinheit. Bevor dieser Aufbau ins Auto wandert, wollte ich wissen, wie sich der Bus auf günstiger Maker-Hardware verhält, und zwar unter Last statt nur im Leerlauf.

Dafür ist [CAN-Lab](https://canlab.andrelademann.de/) entstanden: eine Web-Serial-Konsole im Browser, die zwei Boards gleichzeitig ausliest, den Sender steuert und Durchsatz sowie Fehlerzähler live darstellt. Der Code liegt unter GPL-3.0 auf [GitHub](https://github.com/vergissberlin/example-canbus).

## Testaufbau

| Komponente                                                                                                                                                | Anzahl | Rolle                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------ |
| [ESP32-C3 SuperMini, Doppelpack](https://www.amazon.de/dp/B0FKH3RLXV?tag=thebeatles-21&linkCode=ll2&linkId=05ee94507f65c830feaa4207d27dec6f)\*            | 2      | Sender und Empfänger, CAN-Controller (TWAI) integriert |
| [SN65HVD230 CAN-Transceiver-Modul, 5 Stück](https://www.amazon.de/dp/B0HJW4MVBJ?tag=thebeatles-21&linkCode=ll2&linkId=f60b0d920560a96ffa2ed3e55abd2a9f)\* | 2      | Wandelt die Logikpegel in CAN_H/CAN_L, 3,3 V           |
| Steckbrett und Jumper-Kabel                                                                                                                               | 1 Satz | Verdrahtung                                            |
| USB-Kabel (Daten, nicht nur Laden)                                                                                                                        | 2      | Stromversorgung und Web Serial                         |

Der ESP32-C3 bringt den CAN-Controller mit, das Transceiver-Modul setzt nur die Signale auf Buspegel um. Ein ESP8266 hat keinen CAN-Controller und eignet sich für diesen Aufbau nicht.

![Kommunikation zwischen zwei ESP32-C3 und ihren CAN-Modulen](/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/canbus-communication.svg)

Beide Seiten sind identisch verdrahtet:

| ESP32-C3 | Transceiver |
| -------- | ----------- |
| 3V3      | 3V3         |
| GND      | GND         |
| GPIO 5   | CTX         |
| GPIO 4   | CRX         |

Zwischen den Modulen verbindest du CANH mit CANH, CANL mit CANL und GND mit GND. Jedes Board wird separat per USB versorgt.

![Steckbrett-Aufbau mit Sender, Empfänger, CAN-Modulen und getrennter USB-Versorgung](/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/canbus-breadboard.svg)

Den Aufbau gibt es auch als [interaktives Steckbrett bei Wokwi](https://wokwi.com/projects/478383260674919425). Es dient als Verdrahtungshilfe, nicht als elektrische CAN-Simulation.

**Busparameter:** 500 kbit/s, Standard-ID `0x123` (11 Bit), 8 Datenbytes pro Frame (4 Byte Zähler, 4 Byte Test-ID, Little Endian). Sende-Warteschlange 32 Frames, Empfangswarteschlange 128 Frames.

## Messmethodik

CAN-Lab steuert den Test über ein einfaches Textprotokoll auf der seriellen Schnittstelle:

1. **Handshake:** Beide Boards melden Rolle, Protokollversion und Bitrate (`LAB HELLO`). Weichen die Bitraten ab, startet kein Test.
2. **Scharfschalten:** Der Empfänger wird vorbereitet. Der Sender startet erst, wenn der Empfänger seine Bereitschaft bestätigt.
3. **Last erzeugen:** Der Sender versucht, die Zielrate einzureihen. Was die Sende-Warteschlange nicht annimmt, wird als „abgewiesen“ gezählt, ohne den Nutzlastzähler zu erhöhen. Abgewiesene Versuche erzeugen also keine künstlichen Lücken.
4. **Messen:** Beide Boards melden etwa einmal pro Sekunde ihre Zähler aus einem eigenen Firmware-Messfenster. Die Werte stammen aus der Firmware, nicht aus der Ankunftszeit der USB-Logs.
5. **Lücken erkennen:** Der Empfänger prüft die fortlaufenden Zählerwerte. Fehlt ein Wert, zählt er eine Lücke.

Die Zielrate ist angebotene Last und darf die Kapazität des Busses übersteigen. Genau das ist der Sinn dieses Tests.

## Ergebnisse

Zielrate 10.000 Frames/s, geplante Dauer 60 Sekunden. Der Screenshot entstand während des laufenden Tests nach etwa 28 Sekunden.

![CAN-Lab-Lasttest: Ziel 10.000 FPS, empfangen 4.303 FPS, eingereiht 4.302 FPS, keine Zählerlücken und keine Busfehler](/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/canlab-load-test.webp)

| Messwert                            |               Wert |
| ----------------------------------- | -----------------: |
| Zielrate                            |    10.000 Frames/s |
| Empfangen                           | **4.303 Frames/s** |
| Eingereiht                          |     4.302 Frames/s |
| TX angenommen (gesamt)              |            120.296 |
| RX empfangen (gesamt)               |            120.245 |
| TX-Warteschlange voll / abgewiesen  |            159.311 |
| Vom Scheduler übersprungen          |                392 |
| Zählerlücken                        |              **0** |
| RX-Warteschlange voll / HW-Überlauf |              0 / 0 |
| Busfehler Sender / Empfänger        |          **0 / 0** |
| TX fehlgeschlagen                   |                  0 |
| TX aktuell ausstehend               |                 32 |

Die Kurve für empfangene Frames liegt über die gesamte Messdauer flach bei rund 4.300 Frames/s. Es gibt keine Einbrüche und keinen Abfall über die Zeit.

## Einordnung

**Der Bus war voll.** Ein klassischer CAN-Frame mit 11-Bit-ID und 8 Datenbytes belegt 108 Bit, mit dem Pausenfeld zwischen zwei Frames 111 Bit. Durch Bit-Stuffing können bis zu 24 weitere Bit hinzukommen. Daraus ergibt sich bei 500 kbit/s eine theoretische Obergrenze:

| Bitrate    |      Ohne Stuffing | Maximales Stuffing |
| ---------- | -----------------: | -----------------: |
| 500 kbit/s | ca. 4.505 Frames/s | ca. 3.704 Frames/s |
| 1 Mbit/s   | ca. 9.009 Frames/s | ca. 7.407 Frames/s |

500.000 Bit/s geteilt durch 4.303 Frames/s ergibt rund 116 Bitzeiten pro Frame, also 111 Bit plus durchschnittlich etwa 5 Stuff-Bits. Der gemessene Wert liegt damit im erwarteten Bereich, und der Bus hatte praktisch keine freie Bitzeit mehr.

**Der Sender war nicht der Engpass.** Angenommene und abgewiesene Versuche ergeben zusammen 279.607. Das entspricht ziemlich genau 28 Sekunden bei 10.000 Versuchen pro Sekunde. Der Sender hat also die volle Zielrate angeboten, und die Warteschlange lief voll, weil der Bus die Frames nicht schneller abnehmen konnte.

**Kein Datenverlust.** Null Zählerlücken bedeuten: Jeder eingereihte Frame kam in der richtigen Reihenfolge an. Die Differenz von 51 Frames zwischen gesendeter und empfangener Summe lässt sich plausibel mit den 32 noch ausstehenden Frames in der Sende-Warteschlange und den nicht synchronisierten Messfenstern der beiden Boards erklären.

## Grenzen dieses Tests

- **Zwei Knoten, eine ID.** Arbitrierung zwischen mehreren Sendern wurde nicht getestet.
- **Kurze Leitung auf dem Steckbrett.** Leitungslänge, Stichleitungen und Störungen wie im Fahrzeug spielen hier keine Rolle.
- **Momentaufnahme.** Die Werte stammen aus einem Lauf, der Screenshot entstand nach etwa 28 von 60 Sekunden. Für belastbare Aussagen sind wiederholte und längere Läufe nötig.
- **Volllast ist kein Betriebsziel.** In echten Fahrzeugnetzen plant man mit deutlichem Puffer, damit hochpriore Nachrichten jederzeit durchkommen.
- **Zählerlücken prüfen keine fehlenden letzten Frames.** Gehen die letzten Frames eines Tests verloren, erkennt der Zähler das allein nicht.

## Bauanleitung: Test selbst nachbauen

### 1. Hardware besorgen

Du brauchst zwei ESP32-C3-Boards, zwei SN65HVD230-Module, ein Steckbrett, Jumper-Kabel und zwei USB-Datenkabel (siehe Tabelle oben).

> [!tip] Vor der Bestellung prüfen
> Achte darauf, dass das Board einen **ESP32-C3** trägt, denn die Sketches sind für den C3 SuperMini geschrieben. Andere ESP32-Varianten mit TWAI funktionieren grundsätzlich auch, brauchen aber angepasste Pins.

### 2. Verdrahten

Löte die Stiftleisten an, stecke beide Boards und Module auf und verdrahte sie gemäß der Tabelle im Abschnitt „Testaufbau“. Danach misst du ohne Stromversorgung den Widerstand zwischen CANH und CANL: **etwa 60 Ω** bedeuten, dass beide 120-Ω-Abschlusswiderstände auf den Modulen vorhanden sind. Misst du rund 120 Ω, fehlt an einem Ende die Terminierung.

Verbinde niemals 3V3 mit 3V3 zwischen den Boards und betreibe die Transceiver nie mit 5 V.

### 3. Firmware flashen

Installiere [PlatformIO](https://platformio.org/install), zum Beispiel als VS-Code-Erweiterung oder über die Kommandozeile. Dann:

```bash
git clone https://github.com/vergissberlin/example-canbus.git
cd example-canbus

# Sender flashen (erstes Board angeschlossen)
pio run -e sender -t upload

# Empfänger flashen (zweites Board angeschlossen)
pio run -c receiver.ini -e receiver -t upload
```

Sind beide Boards gleichzeitig angeschlossen, wählst du den Port mit `--upload-port` aus.

### 4. CAN-Lab verbinden

1. Öffne [canlab.andrelademann.de](https://canlab.andrelademann.de/) in **Chrome oder Edge**. Safari unterstützt Web Serial nicht.
2. Schließe zuerst den Empfänger an und klicke auf **Connect USB**, danach den Sender.
3. Kommt keine Ausgabe, drücke kurz **RESET** (nicht BOOT) am betroffenen Board.

Die USB-Daten bleiben in deinem Browser. CAN-Lab lässt sich als App installieren und funktioniert danach auch offline.

### 5. Verbindung prüfen

Im Normalbetrieb sendet der Sender einen Frame pro Sekunde. Steigt der Zähler `RX ID 0x123` beim Empfänger, funktioniert die CAN-Kommunikation. Ein `TX … ok` beim Sender bestätigt nur das Einreihen, nicht den Empfang.

### 6. Lasttest fahren

1. Starte vorsichtig: **100 Frames/s für 10 Sekunden**.
2. Läuft das ohne Lücken und Fehler, erhöhe auf 1.000, dann 5.000 und schließlich 10.000 Frames/s.
3. Wähle als Dauer 60 Sekunden und beobachte, wo die empfangene Rate abflacht.

Erreichst du bei 500 kbit/s Werte um 4.300 Frames/s ohne Lücken, ist dein Aufbau am Limit des Busses.

### 7. Fehlersuche

- **Keine Frames beim Empfänger:** Fehlt die gemeinsame Masse? Das ist die häufigste Ursache.
- **Busfehler steigen sofort:** CANH und CANL vertauscht oder Terminierung fehlt (Widerstand messen).
- **Kein serieller Port:** Ladekabel ohne Datenleitungen oder ein anderer serieller Monitor hält den Port.
- **Lücken bei hoher Rate:** Fehlende USB-Logzeilen können Lücken vortäuschen. Maßgeblich sind die Firmware-Zähler.

## Ausblick

Als Nächstes teste ich 1 Mbit/s, mehrere Sender mit unterschiedlichen IDs und längere Leitungen mit verdrillter Zweidrahtleitung. Danach folgt der Umzug auf das Raspberry Pi 5 mit CAN-HAT und SocketCAN, und dann geht es ins Auto.

Wenn du den Test nachbaust, schick mir deine Werte. Mich interessiert besonders, wie sich andere Transceiver-Module und Kabellängen schlagen.
