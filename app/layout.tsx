import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matchmaker | Practice Emotional Resilience",
  description: "A safe environment for practicing vulnerability, boundary-setting, and relationship repair.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
