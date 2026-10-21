/**
 * Download zu
 * src/content/posts/was-ein-vw-lupo-und-ein-tesla-roadster-gemeinsam-haben.md
 *
 * Das CAN-Lab White Paper: Testergebnisse, Messmethodik und Bauanleitung. Die
 * Anleitung steht nur hier, nicht im Artikel. Inhaltlich synchron halten mit
 * der englischen Ausgabe in ./canlab-whitepaper-en.mjs.
 *
 * Keine Affiliate-Links: Amazon erlaubt Partnerlinks nicht in herunterladbaren
 * Dokumenten, deshalb verweist die Stückliste auf den Artikel.
 */
const IMAGES = "/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common";
const POST_URL =
  "https://blog.andrelademann.de/de/posts/was-ein-vw-lupo-und-ein-tesla-roadster-gemeinsam-haben/";

export default {
  slug: "was-ein-vw-lupo-und-ein-tesla-roadster-gemeinsam-haben",
  fileName: "canlab-whitepaper-de.pdf",
  lang: "de",
  title: "CAN-Lab White Paper",
  subtitle: "CAN-Bus-Lasttest mit zwei ESP32-C3 · Oktober 2026 · v1.0",
  articleUrl:
    "blog.andrelademann.de/de/posts/was-ein-vw-lupo-und-ein-tesla-roadster-gemeinsam-haben",
  sources: [
    {
      title: "CAN-Lab",
      url: "https://canlab.andrelademann.de/",
    },
    {
      title: "vergissberlin/example-canbus",
      note: "Sketches und CAN-Lab-Quellcode, GPL-3.0",
      url: "https://github.com/vergissberlin/example-canbus",
    },
    {
      title: "History of CAN technology",
      note: "CAN in Automation",
      url: "https://www.can-cia.org/can-knowledge/history-of-can-technology",
    },
    {
      title: "CAN bus",
      note: "Wikipedia, Frame-Format und Bit-Stuffing",
      url: "https://en.wikipedia.org/wiki/CAN_bus",
    },
  ],
  pages: [
    {
      subtitle: "Kurzfassung, Motivation und Testaufbau",
      blocks: [
        {
          kind: "note",
          text: "Zwei ESP32-C3-Boards mit SN65HVD230-Transceivern übertragen bei 500 kbit/s stabil **4.303 CAN-Frames pro Sekunde** mit je 8 Datenbytes. Im Messzeitraum traten **keine Zählerlücken, keine Überläufe der Empfangswarteschlange und keine Busfehler** auf. Das sind rund 116 Bitzeiten pro Frame: Der Bus war praktisch voll, begrenzt hat die Leitung, nicht die Hardware.",
        },
        {
          kind: "text",
          title: "Motivation",
          paragraphs: [
            "Ich baue die Elektrik meines Peugeot 304 S neu auf: verteilte ESP32-Knoten mit Sensoren, die über CAN kommunizieren, und ein Raspberry Pi 5 als zentrale Recheneinheit. Bevor dieser Aufbau ins Auto wandert, wollte ich wissen, wie sich der Bus auf günstiger Maker-Hardware verhält, und zwar unter Last statt nur im Leerlauf.",
            "Dafür ist [CAN-Lab](https://canlab.andrelademann.de/) entstanden: eine Web-Serial-Konsole im Browser, die zwei Boards gleichzeitig ausliest, den Sender steuert und Durchsatz sowie Fehlerzähler live darstellt. Der Code ist Open Source unter GPL-3.0 auf [GitHub](https://github.com/vergissberlin/example-canbus).",
          ],
        },
        {
          kind: "table",
          title: "Stückliste",
          head: ["Komponente", "Anzahl", "Rolle"],
          rows: [
            ["ESP32-C3 SuperMini", "2", "Sender und Empfänger, CAN-Controller (TWAI) integriert"],
            ["SN65HVD230-Transceiver-Modul, 3,3 V", "2", "Wandelt Logikpegel in CAN_H/CAN_L"],
            ["Steckbrett und Jumper-Kabel", "1 Satz", "Verdrahtung"],
            ["USB-Kabel (Daten, nicht nur Laden)", "2", "Stromversorgung und Web Serial"],
          ],
        },
        {
          kind: "text",
          paragraphs: [
            `Die Boards und Module, die ich verwendet habe, sind im [Blogartikel](${POST_URL}) verlinkt. Ein ESP8266 hat keinen CAN-Controller und eignet sich nicht.`,
          ],
        },
        {
          kind: "image",
          title: "So kommunizieren die beiden Knoten",
          file: `${IMAGES}/canbus-communication.svg`,
          alt: "Kommunikation zwischen zwei ESP32-C3 und ihren CAN-Modulen",
        },
        {
          kind: "table",
          title: "Verdrahtung, auf beiden Seiten identisch",
          head: ["ESP32-C3", "Transceiver", "Zwischen den Modulen"],
          rows: [
            ["3V3", "3V3", "CANH an CANH"],
            ["GND", "GND", "CANL an CANL"],
            ["GPIO 5", "CTX", "GND an GND"],
            ["GPIO 4", "CRX", "Jedes Board mit eigener USB-Versorgung"],
          ],
        },
        {
          kind: "note",
          text: "**Busparameter:** 500 kbit/s, Standard-ID `0x123` (11 Bit), 8 Datenbytes pro Frame (4 Byte Zähler, 4 Byte Test-ID, Little Endian). Sende-Warteschlange 32 Frames, Empfangswarteschlange 128 Frames.",
        },
      ],
    },
    {
      subtitle: "Steckbrett und Messmethodik",
      blocks: [
        {
          kind: "image",
          title: "Steckbrett-Aufbau",
          file: `${IMAGES}/canbus-breadboard.svg`,
          alt: "Steckbrett-Aufbau mit Sender, Empfänger, CAN-Modulen und getrennter USB-Versorgung",
          maxHeight: "125mm",
          caption:
            "Auch als [interaktives Steckbrett bei Wokwi](https://wokwi.com/projects/478383260674919425) – eine Verdrahtungshilfe, keine elektrische CAN-Simulation.",
        },
        {
          kind: "steps",
          title: "Messmethodik",
          items: [
            "**Handshake.** Beide Boards melden Rolle, Protokollversion und Bitrate (`LAB HELLO`). Weichen die Bitraten ab, startet kein Test.",
            "**Scharfschalten.** Zuerst wird der Empfänger vorbereitet; der Sender startet erst, wenn der Empfänger seine Bereitschaft bestätigt.",
            "**Last erzeugen.** Der Sender versucht, die Zielrate einzureihen. Was die Sende-Warteschlange nicht annimmt, zählt als abgewiesen, ohne den Nutzlastzähler zu erhöhen. Abgewiesene Versuche erzeugen also keine künstlichen Lücken.",
            "**Messen.** Beide Boards melden etwa einmal pro Sekunde ihre Zähler aus einem eigenen Firmware-Messfenster, nicht aus der Ankunftszeit der USB-Logs.",
            "**Lücken erkennen.** Der Empfänger prüft die fortlaufenden Zählerwerte. Fehlt ein Wert, zählt er eine Lücke.",
          ],
        },
        {
          kind: "text",
          paragraphs: [
            "Die Zielrate ist angebotene Last und darf die Kapazität des Busses übersteigen. Genau das ist der Sinn dieses Tests.",
          ],
        },
      ],
    },
    {
      subtitle: "Ergebnisse",
      blocks: [
        {
          kind: "image",
          title: "Lasttest: 10.000 Frames/s angeboten, 60 s geplant",
          file: `${IMAGES}/canlab-load-test.webp`,
          alt: "CAN-Lab-Lasttest: Ziel 10.000 FPS, empfangen 4.303 FPS, eingereiht 4.302 FPS, keine Zählerlücken und keine Busfehler",
          caption: "Aufgenommen während des laufenden Tests, nach etwa 28 Sekunden.",
        },
        {
          kind: "table",
          head: ["Messwert", "Wert", "Messwert", "Wert"],
          rows: [
            ["Zielrate", "10.000 Frames/s", "Zählerlücken", "**0**"],
            ["Empfangen", "**4.303 Frames/s**", "RX-Warteschlange voll / HW-Überlauf", "0 / 0"],
            ["Eingereiht", "4.302 Frames/s", "Busfehler Sender / Empfänger", "**0 / 0**"],
            ["TX angenommen (gesamt)", "120.296", "TX fehlgeschlagen", "0"],
            ["RX empfangen (gesamt)", "120.245", "TX aktuell ausstehend", "32"],
            ["TX-Warteschlange voll / abgewiesen", "159.311", "Vom Scheduler übersprungen", "392"],
          ],
        },
        {
          kind: "text",
          paragraphs: [
            "Die Kurve der empfangenen Frames liegt über die gesamte Messdauer flach bei rund 4.300 Frames/s, ohne Einbrüche und ohne Abfall über die Zeit.",
          ],
        },
      ],
    },
    {
      subtitle: "Einordnung und Grenzen",
      blocks: [
        {
          kind: "text",
          title: "Der Bus war voll",
          paragraphs: [
            "Ein klassischer CAN-Frame mit 11-Bit-ID und 8 Datenbytes belegt 108 Bit, mit dem Pausenfeld zwischen zwei Frames 111 Bit. Durch Bit-Stuffing können bis zu 24 weitere Bit hinzukommen. Daraus ergibt sich eine theoretische Obergrenze:",
          ],
        },
        {
          kind: "table",
          head: ["Bitrate", "Ohne Stuffing", "Maximales Stuffing"],
          rows: [
            ["500 kbit/s", "ca. 4.505 Frames/s", "ca. 3.704 Frames/s"],
            ["1 Mbit/s", "ca. 9.009 Frames/s", "ca. 7.407 Frames/s"],
          ],
        },
        {
          kind: "text",
          paragraphs: [
            "500.000 Bit/s geteilt durch 4.303 Frames/s ergibt rund 116 Bitzeiten pro Frame: 111 Bit plus durchschnittlich etwa 5 Stuff-Bits. Der gemessene Wert liegt im erwarteten Bereich, und der Bus hatte praktisch keine freie Bitzeit mehr.",
          ],
        },
        {
          kind: "points",
          title: "Was die Zähler zeigen",
          items: [
            {
              term: "Der Sender war nicht der Engpass.",
              detail:
                "Angenommene und abgewiesene Versuche ergeben zusammen 279.607 – ziemlich genau 28 Sekunden bei 10.000 Versuchen pro Sekunde. Die Warteschlange lief voll, weil der Bus die Frames nicht schneller abnehmen konnte.",
            },
            {
              term: "Kein Datenverlust.",
              detail:
                "Null Zählerlücken: Jeder eingereihte Frame kam in der richtigen Reihenfolge an. Die Differenz von 51 Frames zwischen den Summen erklärt sich plausibel durch die 32 noch ausstehenden Frames und die nicht synchronisierten Messfenster der beiden Boards.",
            },
          ],
        },
        {
          kind: "points",
          title: "Grenzen dieses Tests",
          items: [
            { term: "Zwei Knoten, eine ID.", detail: "Arbitrierung zwischen mehreren Sendern wurde nicht getestet." },
            { term: "Kurze Leitung auf dem Steckbrett.", detail: "Leitungslänge, Stichleitungen und Störungen wie im Fahrzeug spielen hier keine Rolle." },
            { term: "Momentaufnahme.", detail: "Ein Lauf, aufgenommen nach etwa 28 von 60 Sekunden. Für belastbare Aussagen braucht es wiederholte und längere Läufe." },
            { term: "Volllast ist kein Betriebsziel.", detail: "In echten Fahrzeugnetzen plant man mit deutlichem Puffer, damit hochpriore Nachrichten jederzeit durchkommen." },
            { term: "Fehlende letzte Frames bleiben unbemerkt.", detail: "Gehen die letzten Frames eines Tests verloren, erkennt der Zähler das allein nicht." },
          ],
        },
      ],
    },
    {
      subtitle: "Bauanleitung, Teil 1: Hardware und Firmware",
      blocks: [
        {
          kind: "text",
          title: "1. Hardware besorgen",
          paragraphs: [
            "Zwei ESP32-C3-Boards, zwei SN65HVD230-Module, ein Steckbrett, Jumper-Kabel und zwei USB-Datenkabel (siehe Stückliste). Achte darauf, dass das Board einen **ESP32-C3** trägt: Die Sketches sind für den C3 SuperMini geschrieben. Andere ESP32-Varianten mit TWAI funktionieren grundsätzlich auch, brauchen aber angepasste Pins.",
          ],
        },
        {
          kind: "text",
          title: "2. Verdrahten",
          paragraphs: [
            "Löte die Stiftleisten an, stecke Boards und Module auf und verdrahte sie gemäß der Verdrahtungstabelle. Miss danach ohne Stromversorgung den Widerstand zwischen CANH und CANL: **etwa 60 Ω** bedeuten, dass beide 120-Ω-Abschlusswiderstände auf den Modulen vorhanden sind. Rund 120 Ω heißt, an einem Ende fehlt die Terminierung.",
          ],
        },
        {
          kind: "note",
          text: "Verbinde niemals 3V3 mit 3V3 zwischen den Boards und betreibe die Transceiver nie mit 5 V.",
        },
        {
          kind: "code",
          title: "3. Firmware flashen",
          code: `git clone https://github.com/vergissberlin/example-canbus.git
cd example-canbus

# Sender flashen (erstes Board angeschlossen)
pio run -e sender -t upload

# Empfänger flashen (zweites Board angeschlossen)
pio run -c receiver.ini -e receiver -t upload`,
          caption:
            "Voraussetzung ist [PlatformIO](https://platformio.org/install). Sind beide Boards gleichzeitig angeschlossen, wählst du den Port mit `--upload-port`.",
        },
        {
          kind: "code",
          title: "Der Kern der Sender-Konfiguration",
          code: `#include "driver/twai.h"

constexpr gpio_num_t CAN_TX_PIN = GPIO_NUM_5;
constexpr gpio_num_t CAN_RX_PIN = GPIO_NUM_4;

void setup() {
  twai_general_config_t g = TWAI_GENERAL_CONFIG_DEFAULT(
      CAN_TX_PIN, CAN_RX_PIN, TWAI_MODE_NORMAL);
  g.tx_queue_len = 32;
  twai_timing_config_t t = TWAI_TIMING_CONFIG_500KBITS();
  twai_filter_config_t f = TWAI_FILTER_CONFIG_ACCEPT_ALL();
  twai_driver_install(&g, &t, &f);
  twai_start();
}`,
          caption: "Pins, Sende-Warteschlange, 500 kbit/s und ein Filter, der alle IDs annimmt.",
        },
      ],
    },
    {
      subtitle: "Bauanleitung, Teil 2: CAN-Lab und Lasttest",
      blocks: [
        {
          kind: "steps",
          title: "4. CAN-Lab verbinden",
          items: [
            "Öffne [canlab.andrelademann.de](https://canlab.andrelademann.de/) in **Chrome oder Edge**. Safari unterstützt Web Serial nicht.",
            "Schließe zuerst den Empfänger an und klicke auf **Connect USB**, danach den Sender.",
            "Keine Ausgabe? Drücke kurz **RESET** (nicht BOOT) am betroffenen Board.",
          ],
        },
        {
          kind: "text",
          paragraphs: [
            "Die USB-Daten bleiben in deinem Browser. CAN-Lab lässt sich als App installieren und funktioniert danach auch offline.",
          ],
        },
        {
          kind: "text",
          title: "5. Verbindung prüfen",
          paragraphs: [
            "Im Normalbetrieb sendet der Sender einen Frame pro Sekunde. Steigt der Zähler `RX ID 0x123` beim Empfänger, funktioniert die CAN-Kommunikation. Ein `TX … ok` beim Sender bestätigt nur das Einreihen, nicht den Empfang.",
          ],
        },
        {
          kind: "steps",
          title: "6. Lasttest fahren",
          items: [
            "Starte vorsichtig: **100 Frames/s für 10 Sekunden**.",
            "Läuft das ohne Lücken und Fehler, erhöhe auf 1.000, dann 5.000 und schließlich 10.000 Frames/s.",
            "Wähle als Dauer 60 Sekunden und beobachte, wo die empfangene Rate abflacht. Rund 4.300 Frames/s bei 500 kbit/s ohne Lücken heißt: Dein Aufbau läuft am Limit des Busses.",
          ],
        },
        {
          kind: "points",
          title: "7. Fehlersuche",
          items: [
            { term: "Keine Frames beim Empfänger:", detail: "Fehlt die gemeinsame Masse? Das ist die häufigste Ursache." },
            { term: "Busfehler steigen sofort:", detail: "CANH und CANL vertauscht oder Terminierung fehlt – Widerstand messen." },
            { term: "Kein serieller Port:", detail: "Ladekabel ohne Datenleitungen, oder ein anderer serieller Monitor hält den Port." },
            { term: "Lücken bei hoher Rate:", detail: "Fehlende USB-Logzeilen können Lücken vortäuschen. Maßgeblich sind die Firmware-Zähler." },
          ],
        },
        {
          kind: "text",
          title: "Ausblick",
          paragraphs: [
            "Als Nächstes teste ich 1 Mbit/s, mehrere Sender mit unterschiedlichen IDs und längere verdrillte Leitungen. Danach zieht der Aufbau auf das Raspberry Pi 5 mit CAN-HAT und SocketCAN um, und dann geht es ins Auto. Wenn du den Test nachbaust, schick mir deine Werte.",
          ],
        },
      ],
    },
  ],
};
