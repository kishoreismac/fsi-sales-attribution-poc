export function csvEscape(value: unknown) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

export function csvDate(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

