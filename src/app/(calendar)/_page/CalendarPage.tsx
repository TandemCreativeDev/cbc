import { headers } from "next/headers";
import { Suspense } from "react";
import {
  textNames,
  type CalendarLocale,
  type TextName,
} from "@/lib/calendar/defaults";
import { getPublicState } from "@/lib/calendar/doors";
import { accentFontOptions } from "@/lib/calendar/fontOptions";
import {
  accentFamilies,
  bodyFamilies,
  titleFamilies,
} from "@/lib/calendar/fonts";
import { isMember } from "@/lib/calendar/member";
import {
  defaultDoorRows,
  doorRowsCss,
  sandColor,
  themeVariables,
} from "@/lib/calendar/theme";
import { calendarMarkup, holdingMarkup } from "./markup";
import { getMessages } from "./messages";
import { openingSoundUrl } from "./openingSound";
import { calendarScript } from "./script";
import { calendarCss } from "./styles";

interface PageProps {
  locale: CalendarLocale;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://clarksbowlingclub.com";

const paths = { fr: "/calendrier", en: "/calendar" } as const satisfies Record<
  CalendarLocale,
  string
>;

const scriptJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/[\u2028\u2029]/g, " ");

function pick<Value>(table: Record<string, Value>, key: string, fallback: Value) {
  return Object.hasOwn(table, key) ? table[key] : fallback;
}

async function Calendar({ locale }: PageProps) {
  const requestHeaders = new Headers(await headers());
  const [{ settings, open }, member] = await Promise.all([
    getPublicState(),
    isMember(requestHeaders),
  ]);
  const holding = !open && !member;

  const texts = Object.fromEntries(
    textNames.map((name) => [
      name,
      settings.texts[locale][name].replaceAll("{year}", String(settings.year)),
    ])
  ) as Record<TextName, string>;
  const other = locale === "fr" ? "en" : "fr";
  const messages = getMessages(locale, texts);

  const accent = settings.fonts.accent;
  const accentItalic = pick(accentFontOptions, accent, accentFontOptions.georgia).italic;
  const fonts = [
    `--font-title:${pick(titleFamilies, settings.fonts.title, titleFamilies.georgia)}`,
    `--font-accent:${pick(accentFamilies, accent, accentFamilies.georgia)}`,
    `--font-body:${pick(bodyFamilies, settings.fonts.body, bodyFamilies.system)}`,
  ].join(";");
  const css = calendarCss({
    vars: `${themeVariables(settings.colors)};${fonts}`,
    background: settings.backgroundUrl
      ? `url("${encodeURI(settings.backgroundUrl)}") center/cover fixed no-repeat,`
      : "",
    doorRows: doorRowsCss(settings.doorColors ?? defaultDoorRows(settings.colors)),
    accentStyle: accentItalic ? "italic" : "normal",
  });

  const script = [
    `const M=${scriptJson(messages)},LANG=${scriptJson(locale)},YEAR=${settings.year};`,
    "document.documentElement.lang=LANG;",
    "const fill=(text,values)=>text.replace(/\\{(\\w+)\\}/g,(_,key)=>values[key]);",
    calendarScript.replace("__OPENING_SOUND__", () => scriptJson(openingSoundUrl)),
  ].join("\n");

  const title = `${messages.title} ${messages.accentLine}`;

  return (
    <>
      <title>{title}</title>
      <link rel="canonical" href={`${SITE_URL}${paths[locale]}`} />
      <link rel="alternate" hrefLang="fr" href={`${SITE_URL}${paths.fr}`} />
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}${paths.en}`} />
      <meta name="description" content={messages.intro} />
      <meta name="theme-color" content={sandColor(settings.colors)} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={messages.intro} />
      {settings.shareUrl ? (
        <>
          <meta property="og:image" content={settings.shareUrl} />
          <meta name="twitter:card" content="summary_large_image" />
        </>
      ) : null}
      {holding ? <meta name="robots" content="noindex" /> : null}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        id="calendar-root"
        data-preview={String(member)}
        data-start-preview={String(member && !open)}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: holding ? holdingMarkup(messages, paths[other]) : calendarMarkup(messages, paths[other]),
        }}
      />
      {holding ? null : <script dangerouslySetInnerHTML={{ __html: script }} />}
    </>
  );
}

export function CalendarPage(props: PageProps) {
  return (
    <Suspense fallback={null}>
      <Calendar {...props} />
    </Suspense>
  );
}
