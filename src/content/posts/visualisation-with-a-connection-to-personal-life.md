---
author: André Lademann
pubDatetime: 2022-05-03T00:00:00.000Z
title: "Visualisation with a connection to personal life"
slug: visualisation-with-a-connection-to-personal-life
featured: false
draft: true
tags:
  - grafana
  - node-red
  - influxdb
  - iot
description: "Making data visualisation tangible by monitoring petrol prices in real time with Node-RED, InfluxDB and Grafana."
---

## Hello friends of data

In many of our projects, software is already used to visualise states — CPU load, network traffic — but for many who don't deal with it closely, the "pretty graphics" are incomprehensible in the long run, because they lack a personal connection to these values.

In order to make the visualisation of data palatable to all of us, I came up with the idea of setting up a monitoring system with a personal reference — at least for those who drive a car with an internal combustion engine.

Haven't you often wondered why petrol prices fluctuate so much, even during the course of the day?

![Grafana dashboard showing E10 petrol price trends for ARAL, HEM, JET, Minol, Shell and TOTAL in Leipzig over several days](/images/posts/visualisation-with-a-connection-to-personal-life/screenshot-01.png)

It's nice to see that there's a pattern:

1. It's always most expensive in the morning between 7:00 and 9:00.
2. ARAL is always the most expensive petrol station (in Leipzig!) and JET and SHELL follow a few minutes later, usually a cent cheaper.
3. Leipzig is home to one of the last remaining Minol petrol stations (East German brand) — and it has always been the cheapest.

Visualisation helps!

## The data

Since 2013, all petrol stations have had to make their prices publicly available. This data is collected by service providers and made available as an API. The Tankerkönig API is free:

```http
https://creativecommons.tankerkoenig.de/json/list.php?lat=51.318490&lng=12.375410&rad=4&sort=price&type=e10&apikey=YOUR_KEY
```

**Parameters:**

1. Your location (lat/lng)
2. Search radius
3. Sorting (by price)
4. Fuel type (e10)
5. API key (register at tankerkoenig.de)

Example response:

```json
{
  "ok": true,
  "stations": [
    {
      "id": "e1a15081-261d-9107-e040-0b0a3dfe563c",
      "name": "Leipzig, Dieskaustr. 155",
      "brand": "HEM",
      "dist": 3.6,
      "price": 1.079,
      "isOpen": true
    }
  ]
}
```

## The pipeline

Besides price, the API returns name, address, opening hours and distance to my location. I save this data in 15-minute intervals using Node-RED into an InfluxDB, which Grafana then uses to visualise the data.

![Node-RED flow fetching petrol prices from the Tankerkönig API every 15 minutes and writing the data to InfluxDB and MQTT](/images/posts/visualisation-with-a-connection-to-personal-life/screenshot-02.png)
