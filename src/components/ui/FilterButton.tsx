import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface AlbumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  filter: string;
  isSelected: boolean;
}

export default function FilterButton({
  filter,
  isSelected,
  onClick,
  ...props
}: AlbumButtonProps) {
  return (
    <button
      className={clsx(
        "py-2 px-4 rounded-full transition-colors duration-200 text-nowrap focus:ring-clarks-orange focus-visible:ring-2 focus:outline-none",
        isSelected
          ? "bg-clarks-orange text-black"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      )}
      onClick={onClick}
      aria-pressed={isSelected}
      {...props}
    >
      {filter}
    </button>
  );
}
