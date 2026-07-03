import { describe, expect, it } from "vitest";
import { csvDate, csvEscape } from "@/lib/export/csv";

describe("CSV export helpers", () => {
  it("escapes commas and quotes", () => {
    expect(csvEscape('Green "Valley", Dairy')).toBe('"Green ""Valley"", Dairy"');
  });

  it("converts nullish values to empty cells", () => {
    expect(csvEscape(null)).toBe("");
    expect(csvEscape(undefined)).toBe("");
  });

  it("formats dates as yyyy-mm-dd", () => {
    expect(csvDate(new Date("2026-07-03T12:30:00.000Z"))).toBe("2026-07-03");
    expect(csvDate(null)).toBe("");
  });
});

