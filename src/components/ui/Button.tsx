import clsx from "clsx";

interface ButtonProps {
  label: string;
  disabled?: boolean;
}

export default function TourDate({ label, disabled = false }: ButtonProps) {
  return <button>{label}</button>;
}
