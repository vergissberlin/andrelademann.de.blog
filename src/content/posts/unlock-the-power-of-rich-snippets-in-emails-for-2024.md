---
author: André Lademann
pubDatetime: 2024-01-01T00:00:00.000Z
title: "Unlock the Power of Rich Snippets in Emails for 2024!"
slug: unlock-the-power-of-rich-snippets-in-emails-for-2024
featured: false
draft: true
tags: []
description: "How to use Schema.org rich snippets in emails to add action buttons, event cards and more — visible in Gmail's inbox view."
---

A quick look at my Gmail inbox reveals that an increasing number of senders are leveraging email features to enhance their messages with functional elements. For instance, a "Track Order" button in the list view that takes me directly to package tracking, or a calendar view allowing me to add an event instantly. This piqued my interest, as it could be a valuable feature for my customers. I wanted to understand the mechanics behind it. Initially, examining the email's source code didn't provide much insight, but I soon found an enlightening article from Google: https://developers.google.com/gmail/markup

## Zwei Artikel:

> 1. Schema rich snippets
> 2. Dateien (ics, ical, vCard) als attachement

## Short and sweet

There are different types of enhancement:

1. action button
   - Link like "View order"
   - Rating
2. customisation of search results
3. confirmation cards
   - Event
   - Flight
   - Hotel
   - Restaurant

This is achieved by adding semantic data to the source text of the email. Here is an example with a hotel reservation:

### Example hotel reservation

```html
<html>
  <body>
    <script type="application/ld+json">
    {
      "@context":             "http://schema.org",
      "@type":                "EventReservation",
      "reservationNumber":    "IO12345",
      "underName":            "John Smith",
      "reservationFor": {
        "@type":              "Event",
        "name":               "Google I/O 2013",
        "startDate":          "2013-05-15T08:30:00-08:00",
        "location":           "Moscone Center, 800 Howard St., San Francisco, CA 94103"
      }
    }
    </script>
    <p>Dear John, thanks for booking your Google I/O ticket with us.</p>
  </body>
</html>
```

It should be noted that different places, people and organisations have their own schema types that need to be used. These are based on Schema.org. For development, you can easily send emails with Google App Scripts. Before you do this, you can use the Markup Tester to check whether the semantic markup is correct. Please note that the sender address has to be registered first.

## Tutorial

### 1. Sending a test email with the command line

```bash
echo "Hello World" | mail -s "Test email" someone@example.com
```

E-mails sent in this way will be marked as spam by the e-mail providers.

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1637755308833/LNBs35oyT.png)

Since we only do this for test purposes, we don't bother with it and look for the email in our spam folder.

### 2. Create email content with rich snippet

Create a new text file `content.html` and put the following content in it:

```html
<html>
  <body>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "EventReservation",
      "reservationNumber": "IO12345",
      "underName": "John Smith",
      "reservationFor": {
        "@type": "Event",
        "name": "Google I/O 2013",
        "startDate": "2013-05-15T08:30:00-08:00",
        "location": "Moscone Center, 800 Howard St., San Francisco, CA 94103"
      }
    }
    </script>
  </body>
</html>
```

### 3. Send mail with rich snippets

```bash
cat content.html | mail -a 'Content-Type: text/html' -s "Test email rich snippet" your@address.dev
```

## Conclusion

With rich snippets in emails, we can offer our clients and their customers real added value with simple means. They are displayed particularly prominently in Google's email client. In the field of marketing, these features can also improve the visibility of the email.

---

### Related

- https://www.google.com/webmasters/markup-tester/
- https://developers.google.com/gmail/markup/actions/actions-overview
