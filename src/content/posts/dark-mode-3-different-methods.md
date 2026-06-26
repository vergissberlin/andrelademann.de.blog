---
author: André Lademann
pubDatetime: 2022-04-12T00:00:00.000Z
title: "Dark Mode - 3 different methods"
slug: dark-mode-3-different-methods
featured: false
draft: true
tags:
  - css
  - dark-mode
  - frontend
description: "Three approaches to implementing dark mode in CSS: custom properties, separate files with media queries, and component overrides — with pros and cons for each."
---

1. [Custom Properties](#custom-properties) _(recommended)_
2. Custom UI components
3. Overrides
4. [Different files with HTML media query](#different-files)

## Custom properties

### Vorteile

- Wenig zusätzlicher Code
- Alle Variablen an einer Stelle
- Skalierbar: Leicht erweiterbar für weitere Themes

### Nachteile

- Browsersupport (ältere Browser)
- Wird derzeit nicht von Bootstrap unterstützt

## Different files

When you use bootstrap-sass, it comes with custom properties — but unfortunately Bootstrap doesn't use them in its own mixins for components. So if you want to use custom properties to tint the components, you can't. You have to change the SASS variables: one theme for light mode, another for dark mode.

```html
<head>
  <link
    rel="stylesheet"
    type="text/css"
    media="(prefers-color-scheme: light)"
    href="light-theme.css"
  />
  <link
    rel="stylesheet"
    type="text/css"
    media="(prefers-color-scheme: dark)"
    href="dark-theme.css"
  />
</head>
```

The downside: this doubles the CSS payload for users who switch modes regularly. Watch the [Bootstrap docs](https://getbootstrap.com/docs/5.0/customize/css-variables/) for future native dark mode support.
