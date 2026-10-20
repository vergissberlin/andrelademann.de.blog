---
locale: en
title: "White Paper: CAN Bus Load Test with Two ESP32-C3 Boards"
description: "Test results, methodology and build guide for CAN-Lab: 4,303 frames per second at 500 kbit/s, with no counter gaps and no bus errors."
ogImage: /images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/canlab-og.jpg
canonicalURL: https://blog.andrelademann.de/canlab-whitepaper
---

André Lademann · October 2026 · Version 1.0

> [!note] About affiliate links
> Links marked \* are affiliate links. As an Amazon Associate I earn from qualifying purchases. The price stays the same for you.

## Summary

Two ESP32-C3 boards with SN65HVD230 transceivers carry a steady **4,303 CAN frames per second** at 500 kbit/s, each frame carrying 8 data bytes. During the measurement there were **no counter gaps, no receive-queue overruns and no bus errors**. That works out at roughly 116 bit times per frame, which means the bus was effectively saturated: the wire set the limit, not the hardware.

This paper describes the set-up, the methodology, the results and their limits. It finishes with a step-by-step guide, so you can rebuild the test yourself. The background story is in the blog post [What a VW Lupo and a Tesla Roadster Have in Common](/posts/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/).

## Motivation

I am rebuilding the electrics of my Peugeot 304 S: distributed ESP32 nodes with sensors, talking over CAN, and a Raspberry Pi 5 as the central computer. Before any of that goes into the car, I wanted to know how the bus behaves on cheap maker hardware, under load rather than just idling.

That is why I built [CAN-Lab](https://canlab.andrelademann.de/): a Web Serial console in the browser that reads two boards at once, controls the sender and shows throughput and error counters live. The code is available under GPL-3.0 on [GitHub](https://github.com/vergissberlin/example-canbus).

## Test set-up

| Component                                                                                                                                                    | Qty   | Role                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- | --------------------------------------------------- |
| [ESP32-C3 SuperMini, pack of 2](https://www.amazon.de/dp/B0FKH3RLXV?tag=thebeatles-21&linkCode=ll2&linkId=05ee94507f65c830feaa4207d27dec6f)\*                | 2     | Sender and receiver, built-in CAN controller (TWAI) |
| [SN65HVD230 CAN transceiver module, pack of 5](https://www.amazon.de/dp/B0HJW4MVBJ?tag=thebeatles-21&linkCode=ll2&linkId=f60b0d920560a96ffa2ed3e55abd2a9f)\* | 2     | Converts logic levels to CAN_H/CAN_L, 3.3 V         |
| Breadboard and jumper wires                                                                                                                                  | 1 set | Wiring                                              |
| USB cables (data, not charge-only)                                                                                                                           | 2     | Power and Web Serial                                |

The ESP32-C3 contains the CAN controller; the transceiver module only converts the signals to bus levels. An ESP8266 has no CAN controller and will not work for this set-up.

![Communication between two ESP32-C3 boards and their CAN modules](/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/canbus-communication.svg)

Both sides are wired identically:

| ESP32-C3 | Transceiver |
| -------- | ----------- |
| 3V3      | 3V3         |
| GND      | GND         |
| GPIO 5   | CTX         |
| GPIO 4   | CRX         |

Between the modules, connect CANH to CANH, CANL to CANL and GND to GND. Each board gets its own USB power supply.

![Breadboard set-up with sender, receiver, CAN modules and separate USB power](/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/canbus-breadboard.svg)

The set-up is also available as an [interactive breadboard on Wokwi](https://wokwi.com/projects/478383260674919425). It is a wiring aid, not an electrical CAN simulation.

**Bus parameters:** 500 kbit/s, standard ID `0x123` (11 bits), 8 data bytes per frame (4-byte counter, 4-byte test ID, little endian). Transmit queue 32 frames, receive queue 128 frames.

## Methodology

CAN-Lab drives the test through a simple text protocol over the serial port:

1. **Handshake:** both boards report their role, protocol version and bitrate (`LAB HELLO`). If the bitrates differ, no test starts.
2. **Arming:** the receiver is prepared first. The sender only starts once the receiver confirms it is ready.
3. **Generating load:** the sender tries to queue the target rate. Whatever the transmit queue does not accept counts as "rejected", without incrementing the payload counter, so rejected attempts never create artificial gaps.
4. **Measuring:** both boards report their counters about once per second from their own firmware measurement window. The values come from the firmware, not from USB log arrival times.
5. **Detecting gaps:** the receiver checks the sequence counter. If a value is missing, it counts a gap.

The target rate is offered load and may exceed the bus capacity. That is exactly the point of this test.

## Results

Target rate 10,000 frames/s, planned duration 60 seconds. I took the screenshot while the test was running, about 28 seconds in. The console labels are in German; the table below translates them.

![CAN-Lab load test: target 10,000 FPS, received 4,303 FPS, queued 4,302 FPS, no counter gaps and no bus errors](/images/posts/2026/what-a-vw-lupo-and-a-tesla-roadster-have-in-common/canlab-load-test.webp)

| Measurement                  |              Value |
| ---------------------------- | -----------------: |
| Target rate                  |    10,000 frames/s |
| Received                     | **4,303 frames/s** |
| Queued                       |     4,302 frames/s |
| TX accepted (total)          |            120,296 |
| RX received (total)          |            120,245 |
| TX queue full / rejected     |            159,311 |
| Skipped by scheduler         |                392 |
| Counter gaps                 |              **0** |
| RX queue full / HW overrun   |              0 / 0 |
| Bus errors sender / receiver |          **0 / 0** |
| TX failed                    |                  0 |
| TX currently pending         |                 32 |

The received-frames line stays flat at roughly 4,300 frames/s for the whole run, with no dips and no decline over time.

## Interpretation

**The bus was full.** A classic CAN frame with an 11-bit ID and 8 data bytes takes 108 bits, or 111 bits including the interframe space. Bit stuffing can add up to 24 more bits. At 500 kbit/s this gives a theoretical ceiling of:

| Bitrate    |            No stuffing |    Worst-case stuffing |
| ---------- | ---------------------: | ---------------------: |
| 500 kbit/s | approx. 4,505 frames/s | approx. 3,704 frames/s |
| 1 Mbit/s   | approx. 9,009 frames/s | approx. 7,407 frames/s |

500,000 bit/s divided by 4,303 frames/s gives about 116 bit times per frame: 111 bits plus an average of roughly 5 stuff bits. The measured value sits squarely in the expected range, and the bus had practically no idle bit time left.

**The sender was not the bottleneck.** Accepted and rejected attempts add up to 279,607, which matches 28 seconds at 10,000 attempts per second almost exactly. The sender offered the full target rate, and its queue filled up because the bus could not take frames any faster.

**No data loss.** Zero counter gaps means every queued frame arrived, in order. The difference of 51 frames between the sent and received totals is plausibly explained by the 32 frames still pending in the transmit queue and by the two boards' measurement windows not being synchronised.

## Limits of this test

- **Two nodes, one ID.** Arbitration between several senders was not tested.
- **Short wires on a breadboard.** Cable length, stubs and in-vehicle interference play no part here.
- **A snapshot.** The values come from a single run, captured about 28 of 60 seconds in. Solid conclusions need repeated and longer runs.
- **Full load is not an operating target.** Real vehicle networks are planned with plenty of headroom, so that high-priority messages always get through.
- **Counter gaps cannot detect missing final frames.** If the last frames of a test are lost, the counter alone will not notice.

## Build guide: rebuild the test yourself

### 1. Get the hardware

You need two ESP32-C3 boards, two SN65HVD230 modules, a breadboard, jumper wires and two USB data cables (see the table above).

> [!tip] Check before you order
> Make sure the board carries an **ESP32-C3**, because the sketches are written for the C3 SuperMini. Other ESP32 variants with TWAI work in principle but need adjusted pins.

### 2. Wire it up

Solder the pin headers, place both boards and modules on the breadboard and wire them as shown in the "Test set-up" section. Then, with the power off, measure the resistance between CANH and CANL: **about 60 Ω** means both 120 Ω terminators on the modules are in place. If you read about 120 Ω, one end is missing its termination.

Never connect 3V3 to 3V3 between the boards, and never power the transceivers at 5 V.

### 3. Flash the firmware

Install [PlatformIO](https://platformio.org/install), for example as a VS Code extension or from the command line. Then:

```bash
git clone https://github.com/vergissberlin/example-canbus.git
cd example-canbus

# Flash the sender (first board connected)
pio run -e sender -t upload

# Flash the receiver (second board connected)
pio run -c receiver.ini -e receiver -t upload
```

If both boards are connected at once, pick the port with `--upload-port`.

### 4. Connect CAN-Lab

1. Open [canlab.andrelademann.de](https://canlab.andrelademann.de/) in **Chrome or Edge**. Safari does not support Web Serial.
2. Plug in the receiver first and click **Connect USB**, then do the same for the sender.
3. If there is no output, briefly press **RESET** (not BOOT) on that board.

USB data stays in your browser. CAN-Lab can be installed as an app and then also works offline.

### 5. Check the connection

In normal operation the sender transmits one frame per second. If the `RX ID 0x123` counter on the receiver goes up, CAN communication works. A `TX … ok` on the sender only confirms queueing, not reception.

### 6. Run the load test

1. Start gently: **100 frames/s for 10 seconds**.
2. If that runs without gaps or errors, step up to 1,000, then 5,000 and finally 10,000 frames/s.
3. Set the duration to 60 seconds and watch where the received rate levels off.

If you reach around 4,300 frames/s at 500 kbit/s without gaps, your set-up is running at the limit of the bus.

### 7. Troubleshooting

- **No frames at the receiver:** is the shared ground missing? That is the most common cause.
- **Bus errors climb immediately:** CANH and CANL swapped, or termination missing (measure the resistance).
- **No serial port:** a charge-only cable, or another serial monitor is holding the port.
- **Gaps at high rates:** missing USB log lines can fake gaps. The firmware counters are what counts.

## What comes next

Next I will test 1 Mbit/s, several senders with different IDs, and longer twisted-pair cables. After that the set-up moves to the Raspberry Pi 5 with a CAN HAT and SocketCAN, and then into the car.

If you rebuild the test, send me your numbers. I am particularly curious how other transceiver modules and cable lengths compare.
