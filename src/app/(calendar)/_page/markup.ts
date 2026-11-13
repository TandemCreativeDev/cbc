import type { Messages } from "./messages";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const languageLink = (m: Messages, href: string) =>
  `<a class="language" href="${href}" hreflang="${m.switchLang}" lang="${m.switchLang}" aria-label="${escapeHtml(m.switchLabel)}">${m.switchLang.toUpperCase()}</a>`;

const masthead = (m: Messages, switchHref: string) => `
  <header class="masthead">
    <span class="brand">Clark’s Bowling Club</span>
    ${languageLink(m, switchHref)}
    <button type="button" id="sound" class="sound" aria-pressed="true">${escapeHtml(m.soundOn)}</button>
  </header>`;

const heading = (m: Messages) => `
    <h1 id="title">${escapeHtml(m.title)} <em>${escapeHtml(m.accentLine)}</em></h1>`;

export const holdingMarkup = (m: Messages, switchHref: string) => `
<main>
  <header class="masthead"><span class="brand">Clark’s Bowling Club</span>${languageLink(m, switchHref)}</header>
  <section class="hero" aria-labelledby="title">${heading(m)}
    <p class="intro">${escapeHtml(m.holding)}</p>
  </section>
  <footer>${escapeHtml(m.footer)}</footer>
</main>`;

export const calendarMarkup = (m: Messages, switchHref: string) => `
<main>${masthead(m, switchHref)}
  <section class="hero" aria-labelledby="title">
    <p class="label">${escapeHtml(m.dateRange)}</p>${heading(m)}
    <p class="intro">${escapeHtml(m.intro)}</p>
  </section>
  <div id="preview-tools" class="preview-tools" hidden>
    <button type="button" id="preview-toggle" aria-pressed="false">${escapeHtml(m.previewToggle)}</button>
    <button type="button" id="preview-reset" hidden>${escapeHtml(m.previewReset)}</button>
    <span id="preview-note" hidden>${escapeHtml(m.previewNote)}</span>
  </div>
  <p id="status" role="status">${escapeHtml(m.loading)}</p>
  <div class="grid" id="calendar" aria-label="${escapeHtml(m.gridLabel)}"></div>
  <noscript>${escapeHtml(m.noscript)}</noscript>
  <footer>${escapeHtml(m.footer)}</footer>
</main>
<dialog class="portrait-dialog" id="portrait" aria-labelledby="portrait-title">
  <div class="portrait-screen" id="portrait-screen">
    <section class="portrait-stage">
      <button type="button" class="portrait-close" id="portrait-close" aria-label="${escapeHtml(m.portraitClose)}" autofocus>×</button>
      <p class="portrait-kicker">Clark’s Bowling Club</p>
      <button type="button" class="portrait-record" id="portrait-record" aria-label="${escapeHtml(m.portraitPlay)}">
        <span class="portrait-vinyl" aria-hidden="true"><span class="portrait-label">CBC</span></span>
      </button>
      <div class="portrait-info">
        <p class="portrait-day" id="portrait-day"></p>
        <h2 id="portrait-title"></h2>
        <p class="portrait-description" id="portrait-description" hidden></p>
      </div>
    </section>
  </div>
</dialog>`;
