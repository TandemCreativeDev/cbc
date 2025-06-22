import { twMerge } from "tailwind-merge";
import { useLanguage } from "../../context/LanguageContext";
import Image from "next/image";
import clsx from "clsx";

export default function Toggle({ className }: { className?: string }) {
  const { isFrench, setIsFrench } = useLanguage();

  const handleLanguageToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFrench(e.target.checked);
  };

  return (
    <fieldset className={twMerge("inline-flex items-center", className)}>
      <legend className="sr-only">Choose interface language</legend>

      <span
        className={clsx(
          "mr-3 text-2xl font-medium font-blanch",
          !isFrench ? "text-clarks-orange" : ""
        )}
        lang="en"
        aria-hidden="true"
      >
        EN
      </span>

      <label
        htmlFor="language"
        className="relative w-14 h-7 bg-white rounded-full cursor-pointer focus-within:ring-4 focus-within:ring-clarks-orange"
      >
        <span className="sr-only">
          Switch to {isFrench ? "English" : "French"}
        </span>

        <input
          id="language"
          type="checkbox"
          role="switch"
          checked={isFrench}
          onChange={handleLanguageToggle}
          aria-describedby="language-description"
          className="sr-only peer"
        />

        <div className="relative w-full h-full pointer-events-none">
          <Image
            src="/svg/bowling-ball-toggle.svg"
            alt=""
            className={clsx(
              "absolute h-6 w-6 left-0.5 top-0.5 motion-safe:transition-all motion-safe:duration-300 pointer-events-none",
              isFrench ? "translate-x-7" : ""
            )}
            height={500}
            width={500}
          />
        </div>
      </label>

      <span
        className={clsx(
          "ms-3 text-2xl font-medium font-blanch",
          isFrench ? "text-clarks-orange" : ""
        )}
        lang="fr"
        aria-hidden="true"
      >
        FR
      </span>

      <div id="language-description" className="sr-only">
        Toggle between English and French interface language. Currently set to{" "}
        {isFrench ? "French" : "English"}.
      </div>
    </fieldset>
  );
}
