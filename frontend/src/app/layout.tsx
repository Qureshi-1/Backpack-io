import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import FeedbackWidget from "@/components/FeedbackWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Backport | API Gateway",
  description: "Protect your backend in 30 seconds with Backport.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-zinc-950 text-white min-h-screen selection:bg-emerald-500/30`}
      >
        <ErrorBoundary>
          {children}
          <FeedbackWidget />
        </ErrorBoundary>
      </body>
    </html>
  );
}
