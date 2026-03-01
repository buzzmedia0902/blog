"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-card border-t border-dark-border py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-dark-text mb-4">
              Openclaw Blog
            </h3>
            <p className="text-dark-muted text-sm">
              Openclawの実務活用に関するブログです。
              AIエージェント技術や自動化のインサイトをお届けします。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-dark-text mb-4">リンク</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://openclaw.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-purple hover:text-accent-indigo transition-colors"
                >
                  公式サイト
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-purple hover:text-accent-indigo transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-dark-text mb-4">カテゴリ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-dark-muted">実務活用</span>
              </li>
              <li>
                <span className="text-dark-muted">チュートリアル</span>
              </li>
              <li>
                <span className="text-dark-muted">インサイト</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border pt-8">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-accent-purple hover:border-accent-purple transition-colors text-sm"
            >
              <span>RSSで購読</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 12.627 3 7 3a1 1 0 00-2 0zm0 4a1 1 0 000 2c3.314 0 6 2.686 6 6a1 1 0 102 0c0-4.418-3.582-8-8-8zm.217 15.904a1 1 0 11-1.441-1.441A7.967 7.967 0 019 13a7.967 7.967 0 015.753 2.463 1 1 0 01-1.441 1.441A5.969 5.969 0 009 15a5.969 5.969 0 00-3.783 1.904z" />
              </svg>
            </a>
            <span className="text-dark-muted text-sm">or</span>
            <a
              href="https://note.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-accent-purple hover:border-accent-purple transition-colors text-sm"
            >
              <span>noteでフォロー</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11l-2.293-2.293a1 1 0 010-1.414zm-6 0a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>

          <p className="text-center text-dark-muted text-sm">
            © {currentYear} Openclaw Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
