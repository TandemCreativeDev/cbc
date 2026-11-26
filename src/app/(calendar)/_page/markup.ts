import type { Messages } from "./messages";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const languageLink = (m: Messages, href: string) =>
  `<a class="language" href="${href}" hreflang="${m.switchLang}" lang="${m.switchLang}" aria-label="${escapeHtml(m.switchLabel)}">${m.switchLang.toUpperCase()}</a>`;

const logo = (m: Messages, homeHref: string) =>
  `<a class="brand" href="${homeHref}" aria-label="${escapeHtml(m.homeLabel)}"><span class="brand-script">Clark's</span><span class="brand-caps"><span>BOWLING</span><img src="/svg/bowling-ball-toggle.svg" alt="" width="10" height="10"><span>CLUB</span></span></a>`;

const instagram = (m: Messages) =>
  `<div class="instagram-follow"><span>${escapeHtml(m.instagramLead)}</span><a class="instagram-button" href="https://instagram.com/clarksbowlingclub" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(m.instagramLabel)}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg><span>Instagram</span></a></div>`;

const masthead = (m: Messages, switchHref: string, homeHref: string) => `
  <header class="masthead">
    ${logo(m, homeHref)}
    ${languageLink(m, switchHref)}
    <button type="button" id="sound" class="sound" aria-pressed="true">${escapeHtml(m.soundOn)}</button>
  </header>`;

const heading = (m: Messages) => `
    <h1 id="title">${escapeHtml(m.title)} <em>${escapeHtml(m.accentLine)}</em></h1>`;

export const holdingMarkup = (m: Messages, switchHref: string, homeHref: string) => `
<main>
  <header class="masthead">${logo(m, homeHref)}${languageLink(m, switchHref)}</header>
  <section class="hero" aria-labelledby="title">${heading(m)}
    <p class="intro">${escapeHtml(m.holding)}</p>
  </section>
  <footer>${escapeHtml(m.footer)}</footer>
</main>`;

export const calendarMarkup = (m: Messages, switchHref: string, homeHref: string) => `
<main>${masthead(m, switchHref, homeHref)}
  <section class="hero" aria-labelledby="title">
    <p class="label">${escapeHtml(m.dateRange)}</p>${heading(m)}
    <p class="intro">${escapeHtml(m.intro)}</p>
    ${instagram(m)}
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
