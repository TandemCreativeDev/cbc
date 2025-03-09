import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  isLink?: boolean;
  disabled?: boolean;
}

export default function Button({
  label,
  onClick = () => {},
  className,
  disabled = false,
  isLink = false,
  ...props
}: ButtonProps) {
  const baseClass = "text-center border border-white p-3 min-w-36";
  const enabledClass =
    "bg-white text-black hover:bg-transparent hover:text-white";
  const disabledClass = "bg-gray-800 text-gray-400 cursor-not-allowed";

  return (
    <button
      className={clsx(
        baseClass,
        disabled ? disabledClass : enabledClass,
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={label}
      role={isLink ? "link" : "button"}
      {...props}
    >
      {label}
    </button>
  );
}
