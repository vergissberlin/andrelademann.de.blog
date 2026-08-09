/**
 * Shared A4 layout for the printable cheat sheets.
 *
 * The palette and font are the blog's own light-theme tokens (see
 * src/styles/theme.css) so a printed sheet is recognisably part of the site.
 * Everything here renders from the plain data in ./sheets/*.mjs — the content is
 * the reviewable part, this file is only presentation.
 */

const THEME = {
  background: "#fdfdfd",
  foreground: "#282728",
  accent: "#006cac",
  accentForeground: "#ffffff",
  muted: "#e6e6e6",
  mutedForeground: "#6b7280",
  border: "#ece9e9",
};

const SITE = "blog.andrelademann.de";

/**
 * A4, and generous margins on purpose.
 *
 * Consumer printers refuse to print into a non-printable border that reaches
 * 10–13 mm on the long edges, so a footer sitting 9 mm from the paper edge came
 * out clipped. The bottom margin is the largest of the three because that is
 * where the footer lives.
 */
const PAGE = { width: "210mm", height: "297mm" };
const PAGE_PADDING = "15mm 16mm 18mm";

/** Escape the five characters that can break out of HTML text or an attribute. */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** `**bold**` and `` `code` `` are the only markup the content data may use. */
function inline(value) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="inline">$1</code>');
}

function renderTerm(item) {
  const detail = item.detail ? ` <span>${inline(item.detail)}</span>` : "";
  return `<strong>${inline(item.term)}</strong>${detail}`;
}

function renderChecklist(block) {
  // A scale turns the list into a self-assessment; the tick box would be
  // redundant next to it, so it is one or the other.
  const scale = block.scale
    ? `<span class="scale" aria-hidden="true">${[1, 2, 3, 4, 5]
        .map(step => `<i>${step}</i>`)
        .join("")}</span>`
    : "";
  const marker = block.scale
    ? ""
    : '<span class="box" aria-hidden="true"></span>';

  const rows = block.items
    .map(
      item => `
        <li>
          ${marker}
          <p>${renderTerm(item)}</p>
          ${scale}
        </li>`
    )
    .join("");

  const legend = block.scaleLegend
    ? `<p class="caption">${inline(block.scaleLegend)}</p>`
    : "";

  return `<ul class="checklist">${rows}</ul>${legend}`;
}

function renderPoints(block) {
  const rows = block.items
    .map(item => `<li><p>${renderTerm(item)}</p></li>`)
    .join("");
  return `<ul class="points">${rows}</ul>`;
}

function renderTable(block) {
  const head = block.head
    .map(cell => `<th>${inline(cell)}</th>`)
    .join("");
  const body = block.rows
    .map(
      row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join("")}</tr>`
    )
    .join("");
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function renderCode(block) {
  const caption = block.caption
    ? `<p class="caption">${inline(block.caption)}</p>`
    : "";
  return `<pre><code>${escapeHtml(block.code)}</code></pre>${caption}`;
}

function renderNote(block) {
  return `<p class="note">${inline(block.text)}</p>`;
}

function renderCompare(block) {
  const panes = block.items
    .map(
      item => `
        <div class="pane pane--${item.tone === "good" ? "good" : "bad"}">
          <p class="pane-label">${inline(item.label)}</p>
          <p class="pane-body">${inline(item.text)}</p>
        </div>`
    )
    .join("");
  return `<div class="compare">${panes}</div>`;
}

const RENDERERS = {
  checklist: renderChecklist,
  points: renderPoints,
  table: renderTable,
  code: renderCode,
  note: renderNote,
  compare: renderCompare,
};

function renderBlock(block) {
  const render = RENDERERS[block.kind];
  if (!render) {
    throw new Error(`Unknown cheat sheet block kind: ${block.kind}`);
  }
  const heading = block.title
    ? `<h2>${inline(block.title)}</h2>`
    : "";
  return `<section>${heading}${render(block)}</section>`;
}

function renderPage(page, sheet, pageNumber, pageCount) {
  const blocks = page.blocks.map(renderBlock).join("");
  const sources =
    pageNumber === pageCount && sheet.sources?.length
      ? `<section class="sources">
           <h2>Sources</h2>
           <ul>${sheet.sources
             .map(
               source =>
                 `<li>${inline(source.title)}${
                   source.note ? ` — ${inline(source.note)}` : ""
                 }<br /><span class="url">${escapeHtml(source.url)}</span></li>`
             )
             .join("")}</ul>
         </section>`
      : "";

  return `
    <article class="sheet">
      <header>
        <div>
          <h1>${inline(sheet.title)}</h1>
          <p class="subtitle">${inline(page.subtitle ?? sheet.subtitle)}</p>
        </div>
        <p class="brand">${escapeHtml(SITE)}</p>
      </header>
      <main>${blocks}${sources}</main>
      <footer>
        <span>${escapeHtml(sheet.articleUrl)}</span>
        <span>${pageCount > 1 ? `${pageNumber} / ${pageCount}` : ""}</span>
      </footer>
    </article>`;
}

/**
 * Render one cheat sheet to a complete, self-contained HTML document.
 *
 * `fontCss` carries the @font-face rules with the font embedded as a data URI —
 * passed in rather than fetched here so a single generation run downloads the
 * font once for all sheets.
 */
export function renderCheatSheet(sheet, fontCss = "") {
  const pageCount = sheet.pages.length;
  const pages = sheet.pages
    .map((page, index) => renderPage(page, sheet, index + 1, pageCount))
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(sheet.title)}</title>
<style>
${fontCss}
@page { size: A4; margin: 0; }

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: ${THEME.background};
  color: ${THEME.foreground};
  font-family: "Google Sans Code", ui-monospace, "SFMono-Regular", Menlo, monospace;
  font-size: 8.4pt;
  line-height: 1.4;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.sheet {
  width: ${PAGE.width};
  height: ${PAGE.height};
  padding: ${PAGE_PADDING};
  display: flex;
  flex-direction: column;
  page-break-after: always;
  overflow: hidden;
}
.sheet:last-child { page-break-after: auto; }

header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 6mm;
  border-bottom: 2.5pt solid ${THEME.accent};
  padding-bottom: 3mm;
}
h1 {
  margin: 0;
  font-size: 17pt;
  line-height: 1.15;
  color: ${THEME.accent};
  letter-spacing: -0.01em;
}
.subtitle {
  margin: 1.5mm 0 0;
  font-size: 8.6pt;
  color: ${THEME.mutedForeground};
}
.brand {
  margin: 0;
  font-size: 8pt;
  font-weight: 700;
  color: ${THEME.accent};
  white-space: nowrap;
}

/* min-height: 0 defeats the automatic minimum size of a flex item. Without it
   main grows past the page instead of clipping, the footer gets pushed out of
   the sheet, and the overflow check in generate-cheatsheets.mjs sees nothing. */
main { flex: 1; min-height: 0; overflow: hidden; padding-top: 3.5mm; }

section { margin-bottom: 3.4mm; }
section:last-child { margin-bottom: 0; }

h2 {
  margin: 0 0 1.6mm;
  font-size: 7.4pt;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${THEME.accent};
}

ul { margin: 0; padding: 0; list-style: none; }
li p { margin: 0; }
li span { color: ${THEME.mutedForeground}; }

.checklist li,
.points li {
  display: flex;
  gap: 2.5mm;
  padding: 1.1mm 0;
  border-bottom: 0.5pt solid ${THEME.border};
}
.checklist li:last-child,
.points li:last-child { border-bottom: none; }

.points li { padding-left: 2.5mm; border-left: 2pt solid ${THEME.muted}; }

.box {
  flex: none;
  width: 3.2mm;
  height: 3.2mm;
  margin-top: 0.9mm;
  border: 1pt solid ${THEME.accent};
  border-radius: 0.6mm;
}

.checklist li p { flex: 1; }
.scale {
  flex: none;
  display: flex;
  gap: 1mm;
  margin-top: 0.4mm;
}
.scale i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.2mm;
  height: 4.2mm;
  border: 0.75pt solid ${THEME.accent};
  border-radius: 0.6mm;
  font-style: normal;
  font-size: 6.4pt;
  color: ${THEME.mutedForeground};
}

table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  text-align: left;
  vertical-align: top;
  padding: 1.1mm 2.5mm 1.1mm 0;
  border-bottom: 0.5pt solid ${THEME.border};
}
th {
  font-size: 7.4pt;
  color: ${THEME.foreground};
  border-bottom: 1pt solid ${THEME.accent};
}
tbody tr:last-child td { border-bottom: none; }

pre {
  margin: 0;
  padding: 2mm 2.5mm;
  background: ${THEME.muted};
  border-radius: 1mm;
  font-size: 8pt;
  white-space: pre-wrap;
}
code { font-family: inherit; }
code.inline {
  padding: 0 0.6mm;
  border-radius: 0.5mm;
  background: ${THEME.muted};
  color: ${THEME.foreground};
  /* A flag split across a line break is unreadable, and these tokens are short. */
  white-space: nowrap;
}
/* Inside the tinted blocks the muted background would be invisible. */
.note code.inline,
.pane code.inline,
pre code.inline { background: ${THEME.background}; }
.caption {
  margin: 1mm 0 0;
  font-size: 7.4pt;
  color: ${THEME.mutedForeground};
}

.note {
  margin: 0;
  padding: 2mm 2.5mm;
  border-left: 2.5pt solid ${THEME.accent};
  background: ${THEME.muted};
  border-radius: 0 1mm 1mm 0;
}

.compare { display: flex; gap: 3mm; }
.pane {
  flex: 1;
  padding: 2.5mm 3mm;
  border-radius: 1mm;
  border: 0.75pt solid ${THEME.border};
  background: ${THEME.muted};
}
.pane--good { border-color: ${THEME.accent}; }
.pane-label {
  margin: 0 0 1.5mm;
  font-size: 7.5pt;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${THEME.mutedForeground};
}
.pane--good .pane-label { color: ${THEME.accent}; }
.pane-body { margin: 0; }

.sources { font-size: 6.8pt; color: ${THEME.mutedForeground}; line-height: 1.3; }
.sources li { padding: 0.5mm 0; }
.sources .url { color: ${THEME.accent}; word-break: break-all; }

footer {
  display: flex;
  justify-content: space-between;
  gap: 4mm;
  padding-top: 2.5mm;
  border-top: 0.75pt solid ${THEME.border};
  font-size: 7.5pt;
  color: ${THEME.mutedForeground};
}
</style>
</head>
<body>${pages}</body>
</html>`;
}
