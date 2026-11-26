import { CalendarLanguageToggle } from "./CalendarLanguageToggle";
import type { Messages } from "./messages";

interface MastheadProps {
  messages: Messages;
  isFrench: boolean;
  homeHref: string;
  switchHref: string;
  withSound: boolean;
}

export function Masthead({ messages, isFrench, homeHref, switchHref, withSound }: MastheadProps) {
  return (
    <header className="masthead">
      <a className="brand" href={homeHref} aria-label={messages.homeLabel}>
        <span className="brand-script">Clark&apos;s</span>
        <span className="brand-caps">
          <span>BOWLING</span>
          <img src="/svg/bowling-ball-toggle.svg" alt="" width={10} height={10} />
          <span>CLUB</span>
        </span>
      </a>
      <div className="masthead-tools">
        <CalendarLanguageToggle isFrench={isFrench} href={switchHref} />
        {withSound ? (
          <button type="button" id="sound" className="sound" aria-pressed="true" suppressHydrationWarning>
            {messages.soundOn}
          </button>
        ) : null}
      </div>
    </header>
  );
}
