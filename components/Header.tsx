"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-dark-bg border-b border-dark-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-accent-indigo rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold text-dark-text hidden sm:inline">
              Openclaw Blog
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-dark-muted hover:text-dark-text transition-colors"
            >
              ブログ
            </Link>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-muted hover:text-accent-purple transition-colors flex items-center gap-2"
              title="RSSフィード"
            >
              <span>RSS</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 12.627 3 7 3a1 1 0 00-2 0zm0 4a1 1 0 000 2c3.314 0 6 2.686 6 6a1 1 0 102 0c0-4.418-3.582-8-8-8zm.217 15.904a1 1 0 11-1.441-1.441A7.967 7.967 0 019 13a7.967 7.967 0 015.753 2.463 1 1 0 01-1.441 1.441A5.969 5.969 0 009 15a5.969 5.969 0 00-3.783 1.904z" />
              </svg>
            </a>
            <a
              href="https://openclaw.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-muted hover:text-dark-text transition-colors"
            >
              公式サイト
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
