"use client";

import { FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";

const swatch = (value: string) => value.slice(0, 7);

export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({
    path: path ?? field.name,
  });
  const placeholder =
    typeof field.admin?.placeholder === "string" ? field.admin.placeholder : "";
  const shown = value || placeholder;
  const pickable = /^#[0-9a-f]{6}/i.test(shown) ? swatch(shown) : "#000000";

  return (
    <div className="field-type text">
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          aria-label={`${typeof field.label === "string" ? field.label : field.name} picker`}
          value={pickable}
          onChange={(event) => {
            const alpha = /^#[0-9a-f]{8}$/i.test(shown) ? shown.slice(7) : "";
            setValue(event.target.value + alpha);
          }}
          style={{ width: 48, height: 40, padding: 0, border: 0 }}
        />
        <input
          type="text"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value || null)}
          style={{ flex: 1 }}
        />
      </div>
      {showError && errorMessage ? (
        <div role="alert" style={{ color: "var(--theme-error-500)" }}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
};
