import type { TextFieldSingleValidation } from "payload";

const hexColor = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const message = "Must be a colour such as #a23c20 (3, 4, 6 or 8 hex digits)";

export const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && hexColor.test(value);

export const optionalColor: TextFieldSingleValidation = (value) =>
  !value || isHexColor(value) ? true : message;

export const requiredColor: TextFieldSingleValidation = (value) =>
  isHexColor(value) ? true : message;
