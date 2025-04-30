// import bowlingBall from "../../assets/bowling-ball-toggle.svg";
import { twMerge } from "tailwind-merge";
import { useLanguage } from "../../context/LanguageContext";
import Image from "next/image";
import clsx from "clsx";

export default function Toggle({ className }: { className?: string }) {
  const { isFrench, setIsFrench } = useLanguage();

  const handleLanguageToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFrench(e.target.checked);
    console.log("Language toggled:", e.target.checked ? "French" : "English"); // Debug log
  };

  return (
    <label
      htmlFor="language"
      className={twMerge("inline-flex items-center cursor-pointer", className)}
    >
      <span
        className={clsx(
          "mr-3 text-2xl font-medium font-blanch",
          !isFrench ? "text-clarks-orange" : ""
        )}
      >
        EN
      </span>
      <input
        id="language"
        type="checkbox"
        checked={isFrench}
        onChange={handleLanguageToggle}
        className="sr-only peer"
      />
      <div className="relative w-14 h-7 bg-white rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-clarks-orange">
        <Image
          src="/svg/bowling-ball-toggle.svg"
          alt="Clark's bowling toggle"
          className={clsx(
            "absolute h-6 w-6 left-0.5 top-0.5 motion-safe:transition-all motion-safe:duration-300",
            isFrench ? "translate-x-7" : ""
          )}
          height={500}
          width={500}
        />
      </div>
      <span
        className={clsx(
          "ms-3 text-2xl font-medium font-blanch",
          isFrench ? "text-clarks-orange" : ""
        )}
      >
        FR
      </span>
    </label>
  );
}
