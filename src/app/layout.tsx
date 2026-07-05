import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feed Sales Incentive POC",
  description: "Sales attribution and credit assignment foundation"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
try {
  var uiDesign = localStorage.getItem("fsi-ui-design");
  document.documentElement.dataset.uiDesign = uiDesign === "original" ? "original" : "new";
  var theme = localStorage.getItem("fsi-theme");
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
} catch (error) {
  document.documentElement.dataset.uiDesign = "new";
}
`
          }}
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

