import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        surface: "hsl(var(--surface))",
        "surface-soft": "hsl(var(--surface-soft))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(15, 23, 42, 0.05), 0 14px 38px rgba(15, 23, 42, 0.06)",
        elevated: "0 18px 48px rgba(15, 23, 42, 0.12)",
        focus: "0 0 0 3px hsl(var(--primary) / 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
