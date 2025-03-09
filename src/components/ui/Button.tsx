import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function Button({ label, disabled = false, className, ...props }: ButtonProps) {
  const baseClass = "px-4 py-2 rounded-md font-semibold focus:outline-none transition-colors";
  const enabledClass = "bg-blue-600 text-white hover:bg-blue-700";
  const disabledClass = "bg-gray-400 text-gray-700 cursor-not-allowed";

  return (
    <button
      className={clsx(baseClass, disabled ? disabledClass : enabledClass, className)}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {label}
    </button>
  );
}
