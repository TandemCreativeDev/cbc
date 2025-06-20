import { twMerge } from "tailwind-merge";
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
  helpText?: string;
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
  helpText,
}: InputProps) {
  const { isFrench } = useLanguage();
  const baseClasses =
    "block w-full bg-slate-950 border-white px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-clarks-orange sm:text-sm/6 mt-2.5 focus:outline-none";

  // Set custom validation messages for better UX
  const handleInvalid = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.currentTarget.validity.valueMissing) {
      e.currentTarget.setCustomValidity(
        isFrench ? "Ce champ est obligatoire" : "This field is required"
      );
    } else if (
      e.currentTarget.validity.typeMismatch &&
      e.currentTarget.type === "email"
    ) {
      e.currentTarget.setCustomValidity(
        isFrench
          ? "Veuillez entrer une adresse e-mail valide"
          : "Please enter a valid email address"
      );
    }
  };

  const handleInput = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Clear custom validity message when user starts typing
    e.currentTarget.setCustomValidity("");
  };

  // Generate IDs for help text and descriptions
  const helpTextId = helpText ? `${id}-help` : undefined;
  const describedBy = helpTextId;

  return (
    <div
      className={twMerge("col-span-2 lg:col-span-1", className)}
      role="group"
      aria-labelledby={`${id}-label`}
    >
      <label
        id={`${id}-label`}
        htmlFor={id}
        className={twMerge("block text-sm/6 font-semibold", labelClass)}
      >
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="text-clarks-orange">
              {isFrench ? " (obligatoire)" : " (required)"}
            </span>
            <span className="sr-only"> required</span>
          </>
        ) : null}
      </label>

      {helpText && (
        <div id={helpTextId} className="text-sm text-gray-400 mt-1">
          {helpText}
        </div>
      )}

      {long ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          value={value}
          onChange={onChange}
          onInvalid={handleInvalid}
          onInput={handleInput}
          className={twMerge(baseClasses, inputClass)}
          required={required}
          aria-describedby={describedBy}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onInvalid={handleInvalid}
          onInput={handleInput}
          className={twMerge(baseClasses, inputClass)}
          required={required}
          aria-describedby={describedBy}
        />
      )}
    </div>
  );
}
