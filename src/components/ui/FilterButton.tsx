import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  filter: string;
  isSelected: boolean;
  onToggle?: () => void;
}

export default function FilterButton({
  filter,
  isSelected,
  onToggle,
  onClick,
  ...props
}: FilterButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onToggle?.();
    onClick?.(e);
  };

  return (
    <button
      className={clsx(
        "py-2 px-4 rounded-full transition-colors duration-200 text-nowrap focus:ring-clarks-orange focus-visible:ring-2 focus:outline-none",
        isSelected
          ? "bg-clarks-orange text-black"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      )}
      onClick={handleClick}
      aria-pressed={isSelected}
      aria-label={`Filter by ${filter}${
        isSelected ? ", currently selected" : ", not selected"
      }`}
      {...props}
    >
      {filter}
    </button>
  );
}
