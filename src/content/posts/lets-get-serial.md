---
author: André Lademann
pubDatetime: 2024-03-14T22:01:42.000Z
title: "Let's get serial"
slug: lets-get-serial
featured: false
draft: false
tags:
  - iot
ogImage: "/images/posts/lets-get-serial/hero.jpeg"
description: "The Web Serial API is a browser-based interface that makes it possible to communicate with hardware devices via the serial interface. It is mainly used for communication with development boards such as the ESP32 or Arduino Uno to send and receive dat..."
canonicalURL: https://blog.andrelademann.de/lets-get-serial
---

The Web Serial API is a browser-based interface that makes it possible to communicate with hardware devices via the serial interface. It is mainly used for communication with development boards such as the ESP32 or Arduino Uno to send and receive data.

If you want to make configurations on an ESP32 via the Web Serial API, you must first ensure that the ESP32 is programmed so that it can receive commands via its serial interface and respond to them accordingly. This usually requires firmware that has been specially developed to interpret commands and implement settings or actions on the device.

## Let's do it

I've prepared a all in one Demo for you. All you need is a Computer with a Chromium based browser, an microcontroller and a USB cable to connect both devices.

![Illustration of a browser connecting to an Arduino Uno via USB for bidirectional serial data exchange](/images/posts/lets-get-serial/img-1.png)

At first, let's give it a try:  
[https://vergissberlin.github.io/example-serial-web-api/](https://vergissberlin.github.io/example-serial-web-api/)

![Example page to show how to work with web serial](/images/posts/lets-get-serial/img-2.png)

If you are interested in learning more about this particular example, take a look at the code: [https://github.com/vergissberlin/example-serial-web-api](https://github.com/vergissberlin/example-serial-web-api)

If you want to know how to get started in general, read on.

## How it works in short

### Establish a connection

Firstly, we establish a connection to the microcontroller:

```javascript
let port;

async function connect() {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });

  // Event listener for incoming data
  port.addEventListener("input", ({ data }) => {
    let decoder = new TextDecoder();
    let text = decoder.decode(data);
    console.log("Received:", text);
  });
}

connect(); // Call connect() when your application starts
```

### Send data

Now we can send data like so:

```javascript
async function send() {
  if (!port) return;
  let data = "Hello Arduino!";
  const writer = port.writable.getWriter();
  await writer.write(new TextEncoder().encode(data));
  await writer.releaseLock();
}
```

### Receive the data with you controller

Receiving the data is surprisingly easy:

```javascript
void setup() {
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    String receivedData = Serial.readString();
    Serial.println("Received: " + receivedData);
  }
}

```

`Serial.readString()` can be used to pull the data directly from the stream.

📖

There are more example in the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API).

## Summary

The Web Serial API facilitates browser-based communication with hardware devices via the serial interface, commonly used with development boards like ESP32 or Arduino Uno for data exchange.

Configuring an ESP32 via the Web Serial API requires programming it to receive and respond to commands through its serial interface, typically with specialized firmware.

Check out this all-in-one demo: [Web Serial API Demo](https://vergissberlin.github.io/example-serial-web-api/) and explore the code on GitHub for deeper insights. Establishing a connection and sending/receiving data is straightforward, as demonstrated through the provided JavaScript and Arduino examples.
