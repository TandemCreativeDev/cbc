import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

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
  const baseClass =
    "text-center border border-white min-w-36 p-3 focus:ring-clarks-orange focus-visible:ring-2 focus:outline-none";
  const enabledClass =
    "bg-white text-black hover:bg-transparent hover:text-white";
  const disabledClass = "bg-gray-800 text-gray-400 cursor-not-allowed";

  return (
    <button
      className={twMerge(
        clsx(baseClass, disabled ? disabledClass : enabledClass),
        className
      )}
      onClick={onClick}
      {...(disabled && { disabled })}
      {...(isLink && { role: "link" })}
      {...props}
    >
      {label}
    </button>
  );
}
