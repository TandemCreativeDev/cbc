import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface InputProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  className?: string;
  labelClass?: string;
  inputClass?: string;
  required?: boolean;
  long?: boolean;
}

export default function TextInput({
  label,
  id,
  name,
  type,
  value,
  onChange,
  className,
  labelClass,
  inputClass,
  required = false,
  long = false,
}: InputProps) {
  const { isFrench } = useLanguage();
  const [error, setError] = useState("");
  const baseClasses =
    "block w-full bg-slate-950 border-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-clarks-orange sm:text-sm/6 mt-2.5 focus:outline-none";

  const handleInvalid = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.currentTarget.validity.valueMissing) {
      setError(isFrench ? "Ce champ est obligatoire" : "This field is required");
    } else if (
      e.currentTarget.validity.typeMismatch &&
      e.currentTarget.type === "email"
    ) {
      setError(
        isFrench
          ? "Veuillez entrer une adresse e-mail valide"
          : "Please enter a valid email address"
      );
    }
  };

  const handleInput = () => {
    setError("");
  };

  return (
    <div className={twMerge("col-span-2 lg:col-span-1", className)}>
      <label
        htmlFor={id}
        className={twMerge("block text-sm/6 font-semibold", labelClass)}
      >
        {label}
        {required ? (
          <>
            <span aria-hidden="true">
              {isFrench ? " (obligatoire)" : " (required)"}
            </span>
            <span className="hidden"> required</span>
          </>
        ) : null}
      </label>
      {long ? (
        <>
          <textarea
            id={id}
            name={name}
            rows={4}
            value={value}
            onChange={onChange}
            className={twMerge(baseClasses, inputClass)}
            required={required}
            onInvalid={handleInvalid}
            onInput={handleInput}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          {error && (
            <p
              id={`${id}-error`}
              className="mt-1 text-red-600"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}
        </>
      ) : (
        <>
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={twMerge(baseClasses, inputClass)}
            required={required}
            onInvalid={handleInvalid}
            onInput={handleInput}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          {error && (
            <p
              id={`${id}-error`}
              className="mt-1 text-red-600"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
