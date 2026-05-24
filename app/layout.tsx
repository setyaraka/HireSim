import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireSim | AI Interview Practice",
  description: "Practice realistic interviews with AI feedback from your CV and target role."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
