interface CssInput {
  vars: string;
  background: string;
  doorRows: string;
  accentStyle: "italic" | "normal";
}

export const calendarCss = ({ vars, background, doorRows, accentStyle }: CssInput) => `
*{box-sizing:border-box}
:root{color-scheme:light;${vars}}
body{margin:0;background:${background}radial-gradient(ellipse at 94% 0%,var(--glow-soft),transparent 52%),var(--sand);color:var(--ink);font:16px/1.5 var(--font-body)}
main{width:min(1120px,100% - 40px);margin:auto;padding:42px 0 48px}
.masthead{display:flex;align-items:center;justify-content:space-between;gap:14px;border-bottom:2px solid var(--ink);padding-bottom:16px}
.brand,.label,.month{letter-spacing:.16em;text-transform:uppercase;font-size:.69rem;font-weight:700}
.brand{color:var(--ink);font-size:.78rem;letter-spacing:.14em}
button{font:inherit;color:inherit;cursor:pointer}
.sound{border:1px solid var(--ink);border-radius:30px;background:var(--paper);padding:7px 14px;font-size:.78rem}
.preview-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 14px}
.preview-tools[hidden]{display:none}
.preview-tools button{border:1px solid var(--ink);background:var(--paper);border-radius:20px;padding:7px 12px;font-size:.83rem}
.preview-tools button[aria-pressed=true]{background:var(--orange);color:var(--paper)}
.preview-tools span{color:var(--quiet);font-size:.82rem}
button:focus-visible,.case-download:focus-visible{outline:2px solid var(--ink);outline-offset:4px}
.hero{position:relative;isolation:isolate;overflow:hidden;padding:44px 0 30px}
.hero::after,.portrait-vinyl{border-radius:50%;background:radial-gradient(circle,var(--vinyl-core) 0 2%,var(--gold) 2.5% 17%,var(--ring) 17.5% 25%,transparent 25.5%),repeating-radial-gradient(circle,var(--groove-a) 0 4px,var(--groove-b) 5px 6px,var(--groove-a) 7px 11px);box-shadow:0 0 0 8px var(--rim-a),0 0 0 19px var(--rim-b)}
.hero::after{content:"";position:absolute;z-index:-1;width:clamp(210px,42vw,520px);aspect-ratio:1;right:-2%;top:14px;transform:rotate(-12deg);opacity:.93}
.label{display:inline-block;margin:0 0 14px;padding:4px 11px;border:1px solid var(--orange);border-radius:20px;color:var(--orange);background:var(--sand)}
h1{font:bold clamp(3.25rem,8vw,7rem)/.87 var(--font-title);letter-spacing:-.075em;margin:0;max-width:68%;text-wrap:balance}
h1 em{display:block;color:var(--orange);font-weight:normal;font-family:var(--font-accent);font-style:${accentStyle}}
.intro{color:var(--quiet);margin:22px 0 0;max-width:min(52%,32rem)}
#status{color:var(--quiet);min-height:1.5em;margin:0 0 14px;font-size:.88rem}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;align-items:start}
.day{position:relative;isolation:isolate;border:1px solid var(--ink);border-radius:7px;background:var(--locked-color);overflow:hidden;perspective:950px;box-shadow:2px 3px 0 var(--card-shadow-soft)}
${doorRows}
.day.is-open{align-self:stretch;display:flex;flex-direction:column;background:var(--door-color)}
.day.is-open .door{flex:none}
.door{position:relative;display:flex;width:100%;aspect-ratio:1.75;align-items:center;justify-content:space-between;gap:8px;padding:12px 18px;text-align:left;border:0;background:var(--door-color);color:var(--door-ink)}
.door[aria-expanded=false]:not(:disabled):hover{filter:brightness(1.1)}
.door:disabled{cursor:default;color:var(--ink);background:var(--locked-color)}
.door:focus-visible{outline-color:currentColor;outline-offset:-4px}
.date{display:grid;gap:2px}
.number{font:bold clamp(2rem,5vw,4rem)/1 var(--font-title);letter-spacing:-.065em;font-variant-numeric:lining-nums tabular-nums}
.month{letter-spacing:.12em}
.mark{font-size:1rem}
.door[aria-expanded=true]{background:transparent}
.day.is-open:not(.is-playable) .door{cursor:default}
.day.is-playable{touch-action:pan-y pinch-zoom;cursor:pointer;user-select:none;-webkit-touch-callout:none}
.day.is-playable .mark{display:grid;place-items:center;width:2rem;height:2rem;flex-shrink:0;border:1px solid currentColor;border-radius:50%;font-size:.9rem}
.case-progress{position:absolute;inset:0;z-index:-1;pointer-events:none;background:var(--shade-soft);transform:scaleX(var(--progress,0));transform-origin:left center;transition:transform .2s linear}
.day.is-scrubbing .case-progress{transition:none}
.close-door{position:absolute;z-index:2;top:3px;right:3px;width:38px;height:38px;padding:0;border:0;border-radius:50%;background:transparent;font-size:1.3rem;line-height:1}
.close-door:hover{background:var(--shade-soft)}
.close-door:focus-visible{outline-color:currentColor;outline-offset:-2px}
.door.revealing{transform-origin:left center;animation:unseal .58s cubic-bezier(.18,.68,.2,1)}
@keyframes unseal{0%{transform:rotateY(0);background:var(--door-color)}38%{transform:rotateY(-46deg);filter:brightness(1.27);background:var(--door-color)}100%{transform:rotateY(0);background:transparent}}
.gift{position:relative;padding:13px 14px 16px;border-top:1px solid var(--shade-rule);color:var(--door-ink)}
.gift:not([hidden]),.gift-content{display:flex;flex:1;flex-direction:column}
.gift.revealing{animation:appear .45s .12s both}
@keyframes appear{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
.gift h2{margin:0 0 7px;font:normal 1.28rem/1.2 var(--font-title);overflow-wrap:anywhere}
.gift h2{padding-right:28px}
.gift p{margin:8px 0 0;font-size:.85rem;white-space:pre-wrap;overflow-wrap:anywhere}
.case-time{display:block;margin:8px 0 9px;font-size:.75rem;font-variant-numeric:tabular-nums;text-align:right}
.case-download{display:inline-flex;align-self:flex-start;align-items:center;gap:5px;margin-top:auto;padding:6px 10px;border:1px solid currentColor;border-radius:20px;color:inherit;font-size:.75rem;font-weight:600;text-decoration:none}
.case-download:hover{background:var(--shade-soft)}
.case-download:focus-visible{outline-color:currentColor;outline-offset:2px}
.case-audio{display:none}
.portrait-dialog{position:fixed;inset:0;width:100%;height:100%;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:var(--ink);color:var(--ink);overflow:hidden}
.portrait-dialog::backdrop{background:var(--ink)}
html:has(.portrait-dialog[open]){overflow:hidden}
.portrait-screen{display:grid;justify-items:center;width:100%;height:100%;overflow:auto;background:var(--ink)}
.portrait-stage{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(12px,3dvh,30px);width:min(100%,56.25dvh);min-height:100%;padding:clamp(44px,8dvh,88px) clamp(18px,5vw,40px);text-align:center;background:radial-gradient(ellipse at 50% 42%,var(--sunrise) 0,transparent 63%),linear-gradient(var(--sunset),var(--sand))}
.portrait-close{position:absolute;top:max(10px,env(safe-area-inset-top));right:max(10px,env(safe-area-inset-right));width:44px;height:44px;border:0;border-radius:50%;background:transparent;font-size:1.5rem}
.portrait-close:hover{background:var(--ink-hover)}
.portrait-kicker,.portrait-day{margin:0;text-transform:uppercase;letter-spacing:.18em;font-size:.72rem;font-weight:750}
.portrait-day{color:var(--orange)}
.portrait-record{display:grid;place-items:center;width:min(88%,43dvh,420px);aspect-ratio:1;flex:none;padding:0;border:0;border-radius:50%;background:transparent;touch-action:manipulation}
.portrait-vinyl{display:grid;place-items:center;width:100%;height:100%;animation:portrait-spin 4.4s linear infinite;animation-play-state:paused}
.portrait-label{padding:.08em .2em;border-radius:1em;background:var(--gold);font:bold clamp(1rem,4vw,1.65rem)/1 var(--font-title);letter-spacing:.08em}
.portrait-record[data-playing=true] .portrait-vinyl{animation-play-state:running}
@keyframes portrait-spin{to{transform:rotate(1turn)}}
.portrait-info{width:100%;max-width:36ch}
.portrait-info h2{margin:7px 0 0;font:bold clamp(1.9rem,6vw,3.8rem)/.97 var(--font-title);letter-spacing:-.06em;overflow-wrap:anywhere}
.portrait-description{margin:12px 0 0;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--quiet);font-size:.9rem}
@media(orientation:portrait){.portrait-stage{width:100%}}
footer{border-top:2px solid var(--ink);margin-top:28px;padding-top:14px;color:var(--quiet);font-size:.75rem}
@media(max-width:720px){.hero::after{right:-12%;opacity:.77}.grid{grid-template-columns:repeat(3,minmax(0,1fr))}.door{padding:9px 12px}.gift{padding:10px}}
@media(max-width:460px){main{width:calc(100% - 26px);padding-top:22px}.hero{padding:33px 0 24px}.hero::after{right:-34%;top:37px;opacity:.28}h1{max-width:100%}.intro{max-width:31ch}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.brand{max-width:18ch}}
@media(prefers-reduced-motion:reduce){.door.revealing,.gift.revealing,.portrait-vinyl{animation:none}.case-progress{transition:none}}
:is(h1,h1 em,.number,.gift h2,.portrait-label,.portrait-info h2){font-synthesis:none}
.day.has-image .gift{background:linear-gradient(color-mix(in srgb,var(--door-color) 78%,transparent),color-mix(in srgb,var(--door-color) 78%,transparent)),var(--door-image) center/cover}
`;
