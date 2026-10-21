/**
 * Companion download for
 * src/content/posts/what-a-vw-lupo-and-a-tesla-roadster-have-in-common.md
 *
 * The CAN-Lab white paper: test results, methodology and the build guide. The
 * guide lives only here, not in the post. Keep it in step with the German
 * edition in ./canlab-whitepaper-de.mjs.
 *
 * No affiliate links: Amazon does not allow partner links in downloadable
 * documents, so the parts list points back to the post instead.
 */
const IMAGES = "/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common";
const POST_URL =
  "https://blog.andrelademann.de/posts/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/";

export default {
  slug: "what-a-vw-lupo-and-a-tesla-roadster-have-in-common",
  fileName: "canlab-whitepaper.pdf",
  lang: "en",
  title: "CAN-Lab White Paper",
  subtitle: "CAN bus load test with two ESP32-C3 boards · October 2026 · v1.0",
  articleUrl:
    "blog.andrelademann.de/posts/what-a-vw-lupo-and-a-tesla-roadster-have-in-common",
  sources: [
    {
      title: "CAN-Lab",
      url: "https://canlab.andrelademann.de/",
    },
    {
      title: "vergissberlin/example-canbus",
      note: "sketches and CAN-Lab source, GPL-3.0",
      url: "https://github.com/vergissberlin/example-canbus",
    },
    {
      title: "History of CAN technology",
      note: "CAN in Automation",
      url: "https://www.can-cia.org/can-knowledge/history-of-can-technology",
    },
    {
      title: "CAN bus",
      note: "Wikipedia, frame format and bit stuffing",
      url: "https://en.wikipedia.org/wiki/CAN_bus",
    },
  ],
  pages: [
    {
      subtitle: "Summary, motivation and test set-up",
      blocks: [
        {
          kind: "note",
          text: "Two ESP32-C3 boards with SN65HVD230 transceivers carry a steady **4,303 CAN frames per second** at 500 kbit/s, each with 8 data bytes. During the measurement there were **no counter gaps, no receive-queue overruns and no bus errors**. That is about 116 bit times per frame: the bus was effectively saturated, so the wire set the limit, not the hardware.",
        },
        {
          kind: "text",
          title: "Motivation",
          paragraphs: [
            "I am rebuilding the electrics of my Peugeot 304 S: distributed ESP32 nodes with sensors, talking over CAN, and a Raspberry Pi 5 as the central computer. Before any of that goes into the car, I wanted to know how the bus behaves on cheap maker hardware, under load rather than just idling.",
            "That is why I built [CAN-Lab](https://canlab.andrelademann.de/): a Web Serial console in the browser that reads two boards at once, controls the sender and shows throughput and error counters live. The code is open source under GPL-3.0 on [GitHub](https://github.com/vergissberlin/example-canbus).",
          ],
        },
        {
          kind: "table",
          title: "Parts",
          head: ["Component", "Qty", "Role"],
          rows: [
            ["ESP32-C3 SuperMini", "2", "Sender and receiver, built-in CAN controller (TWAI)"],
            ["SN65HVD230 transceiver module, 3.3 V", "2", "Converts logic levels to CAN_H/CAN_L"],
            ["Breadboard and jumper wires", "1 set", "Wiring"],
            ["USB cables (data, not charge-only)", "2", "Power and Web Serial"],
          ],
        },
        {
          kind: "text",
          paragraphs: [
            `The exact boards and modules I used are linked in the [blog post](${POST_URL}). An ESP8266 has no CAN controller and will not work here.`,
          ],
        },
        {
          kind: "image",
          title: "How the two nodes talk",
          file: `${IMAGES}/canbus-communication.svg`,
          alt: "Communication between two ESP32-C3 boards and their CAN modules",
        },
        {
          kind: "table",
          title: "Wiring, identical on both sides",
          head: ["ESP32-C3", "Transceiver", "Between the modules"],
          rows: [
            ["3V3", "3V3", "CANH to CANH"],
            ["GND", "GND", "CANL to CANL"],
            ["GPIO 5", "CTX", "GND to GND"],
            ["GPIO 4", "CRX", "Each board on its own USB supply"],
          ],
        },
        {
          kind: "note",
          text: "**Bus parameters:** 500 kbit/s, standard ID `0x123` (11 bits), 8 data bytes per frame (4-byte counter, 4-byte test ID, little endian). Transmit queue 32 frames, receive queue 128 frames.",
        },
      ],
    },
    {
      subtitle: "Breadboard layout and methodology",
      blocks: [
        {
          kind: "image",
          title: "Breadboard layout",
          file: `${IMAGES}/canbus-breadboard.svg`,
          alt: "Breadboard set-up with sender, receiver, CAN modules and separate USB power",
          maxHeight: "125mm",
          caption:
            "Also available as an [interactive breadboard on Wokwi](https://wokwi.com/projects/478383260674919425) — a wiring aid, not an electrical CAN simulation.",
        },
        {
          kind: "steps",
          title: "Methodology",
          items: [
            "**Handshake.** Both boards report role, protocol version and bitrate (`LAB HELLO`). If the bitrates differ, no test starts.",
            "**Arming.** The receiver is prepared first; the sender only starts once the receiver confirms it is ready.",
            "**Generating load.** The sender tries to queue the target rate. Whatever the transmit queue does not accept counts as rejected, without incrementing the payload counter, so rejected attempts never create artificial gaps.",
            "**Measuring.** Both boards report their counters about once per second from their own firmware measurement window, not from USB log arrival times.",
            "**Detecting gaps.** The receiver checks the sequence counter. A missing value counts as a gap.",
          ],
        },
        {
          kind: "text",
          paragraphs: [
            "The target rate is offered load and may exceed the bus capacity. That is exactly the point of this test.",
          ],
        },
      ],
    },
    {
      subtitle: "Results",
      blocks: [
        {
          kind: "image",
          title: "Load test: 10,000 frames/s offered, 60 s planned",
          file: `${IMAGES}/canlab-load-test.webp`,
          alt: "CAN-Lab load test: target 10,000 FPS, received 4,303 FPS, queued 4,302 FPS, no counter gaps and no bus errors",
          caption:
            "Captured while the test was running, about 28 seconds in. The console labels are German; the table translates them.",
        },
        {
          kind: "table",
          head: ["Measurement", "Value", "Measurement", "Value"],
          rows: [
            ["Target rate", "10,000 frames/s", "Counter gaps", "**0**"],
            ["Received", "**4,303 frames/s**", "RX queue full / HW overrun", "0 / 0"],
            ["Queued", "4,302 frames/s", "Bus errors sender / receiver", "**0 / 0**"],
            ["TX accepted (total)", "120,296", "TX failed", "0"],
            ["RX received (total)", "120,245", "TX currently pending", "32"],
            ["TX queue full / rejected", "159,311", "Skipped by scheduler", "392"],
          ],
        },
        {
          kind: "text",
          paragraphs: [
            "The received-frames line stays flat at roughly 4,300 frames/s for the whole run, with no dips and no decline over time.",
          ],
        },
      ],
    },
    {
      subtitle: "Interpretation and limits",
      blocks: [
        {
          kind: "text",
          title: "The bus was full",
          paragraphs: [
            "A classic CAN frame with an 11-bit ID and 8 data bytes takes 108 bits, or 111 bits including the interframe space. Bit stuffing can add up to 24 more bits. That gives a theoretical ceiling of:",
          ],
        },
        {
          kind: "table",
          head: ["Bitrate", "No stuffing", "Worst-case stuffing"],
          rows: [
            ["500 kbit/s", "approx. 4,505 frames/s", "approx. 3,704 frames/s"],
            ["1 Mbit/s", "approx. 9,009 frames/s", "approx. 7,407 frames/s"],
          ],
        },
        {
          kind: "text",
          paragraphs: [
            "500,000 bit/s divided by 4,303 frames/s gives about 116 bit times per frame: 111 bits plus an average of roughly 5 stuff bits. The measured value sits squarely in the expected range, and the bus had practically no idle bit time left.",
          ],
        },
        {
          kind: "points",
          title: "What the counters show",
          items: [
            {
              term: "The sender was not the bottleneck.",
              detail:
                "Accepted plus rejected attempts add up to 279,607 — almost exactly 28 seconds at 10,000 attempts per second. The queue filled up because the bus could not take frames any faster.",
            },
            {
              term: "No data loss.",
              detail:
                "Zero counter gaps: every queued frame arrived, in order. The difference of 51 frames between the totals is plausibly explained by the 32 frames still pending and the unsynchronised measurement windows of the two boards.",
            },
          ],
        },
        {
          kind: "points",
          title: "Limits of this test",
          items: [
            { term: "Two nodes, one ID.", detail: "Arbitration between several senders was not tested." },
            { term: "Short wires on a breadboard.", detail: "Cable length, stubs and in-vehicle interference play no part here." },
            { term: "A snapshot.", detail: "One run, captured about 28 of 60 seconds in. Solid conclusions need repeated and longer runs." },
            { term: "Full load is not an operating target.", detail: "Real vehicle networks are planned with plenty of headroom, so that high-priority messages always get through." },
            { term: "Missing final frames go unnoticed.", detail: "If the last frames of a test are lost, the counter alone cannot detect it." },
          ],
        },
      ],
    },
    {
      subtitle: "Build guide, part 1: hardware and firmware",
      blocks: [
        {
          kind: "text",
          title: "1. Get the hardware",
          paragraphs: [
            "Two ESP32-C3 boards, two SN65HVD230 modules, a breadboard, jumper wires and two USB data cables (see the parts list). Make sure the board carries an **ESP32-C3**: the sketches are written for the C3 SuperMini. Other ESP32 variants with TWAI work in principle but need adjusted pins.",
          ],
        },
        {
          kind: "text",
          title: "2. Wire it up",
          paragraphs: [
            "Solder the pin headers, place both boards and modules on the breadboard and wire them as shown in the wiring table. Then, with the power off, measure the resistance between CANH and CANL: **about 60 Ω** means both 120 Ω terminators on the modules are in place. About 120 Ω means one end is missing its termination.",
          ],
        },
        {
          kind: "note",
          text: "Never connect 3V3 to 3V3 between the boards, and never power the transceivers at 5 V.",
        },
        {
          kind: "code",
          title: "3. Flash the firmware",
          code: `git clone https://github.com/vergissberlin/example-canbus.git
cd example-canbus

# Flash the sender (first board connected)
pio run -e sender -t upload

# Flash the receiver (second board connected)
pio run -c receiver.ini -e receiver -t upload`,
          caption:
            "Requires [PlatformIO](https://platformio.org/install). With both boards connected at once, pick the port with `--upload-port`.",
        },
        {
          kind: "code",
          title: "The core of the sender configuration",
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
          caption: "Pins, transmit queue, 500 kbit/s and a filter that accepts every ID.",
        },
      ],
    },
    {
      subtitle: "Build guide, part 2: CAN-Lab and the load test",
      blocks: [
        {
          kind: "steps",
          title: "4. Connect CAN-Lab",
          items: [
            "Open [canlab.andrelademann.de](https://canlab.andrelademann.de/) in **Chrome or Edge**. Safari does not support Web Serial.",
            "Plug in the receiver first and click **Connect USB**, then do the same for the sender.",
            "No output? Briefly press **RESET** (not BOOT) on that board.",
          ],
        },
        {
          kind: "text",
          paragraphs: [
            "USB data stays in your browser. CAN-Lab can be installed as an app and then also works offline.",
          ],
        },
        {
          kind: "text",
          title: "5. Check the connection",
          paragraphs: [
            "In normal operation the sender transmits one frame per second. If the `RX ID 0x123` counter on the receiver goes up, CAN communication works. A `TX … ok` on the sender only confirms queueing, not reception.",
          ],
        },
        {
          kind: "steps",
          title: "6. Run the load test",
          items: [
            "Start gently: **100 frames/s for 10 seconds**.",
            "If that runs without gaps or errors, step up to 1,000, then 5,000 and finally 10,000 frames/s.",
            "Set the duration to 60 seconds and watch where the received rate levels off. Around 4,300 frames/s at 500 kbit/s without gaps means your set-up runs at the limit of the bus.",
          ],
        },
        {
          kind: "points",
          title: "7. Troubleshooting",
          items: [
            { term: "No frames at the receiver:", detail: "is the shared ground missing? That is the most common cause." },
            { term: "Bus errors climb immediately:", detail: "CANH and CANL swapped, or termination missing — measure the resistance." },
            { term: "No serial port:", detail: "a charge-only cable, or another serial monitor is holding the port." },
            { term: "Gaps at high rates:", detail: "missing USB log lines can fake gaps. The firmware counters are what counts." },
          ],
        },
        {
          kind: "text",
          title: "What comes next",
          paragraphs: [
            "Next I will test 1 Mbit/s, several senders with different IDs and longer twisted-pair cables. Then the set-up moves to the Raspberry Pi 5 with a CAN HAT and SocketCAN, and into the car. If you rebuild the test, send me your numbers.",
          ],
        },
      ],
    },
  ],
};
