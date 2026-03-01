import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Openclaw Blog - AI自動化のインサイト",
  description:
    "Openclawの実務活用に関するブログです。AIエージェント技術や自動化のインサイトをお届けします。",
  keywords: [
    "Openclaw",
    "AI",
    "自動化",
    "ワークフロー",
    "エージェント",
    "実務活用",
  ],
  authors: [{ name: "Openclaw Team" }],
  openGraph: {
    title: "Openclaw Blog",
    description:
      "Openclawの実務活用に関するブログです。AIエージェント技術や自動化のインサイトをお届けします。",
    type: "website",
    url: "https://blog.openclaw.io",
    siteName: "Openclaw Blog",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-dark-bg text-dark-text">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
