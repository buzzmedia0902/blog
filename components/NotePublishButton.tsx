"use client";

import { useState } from "react";
import { BlogPost } from "@/lib/types";

interface NotePublishButtonProps {
  post: BlogPost;
}

export function NotePublishButton({ post }: NotePublishButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Markdown を保持しながらnote.com用に整形
  const formatContentForNote = (markdown: string): string => {
    return markdown
      // リンクのフォーマット
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
      // 箇条書きを整形
      .replace(/^- /gm, "• ")
      // 段落区切りを追加
      .replace(/\n\n/g, "\n\n")
      .trim();
  };

  // note.com 投稿フォーマット生成
  const generateNoteFormat = (): string => {
    const formattedContent = formatContentForNote(post.content);
    const tags = post.tags.map((tag) => `#${tag}`).join(" ");
    const sourceUrl = `https://blog.openclaw.io/blog/${post.slug}`;
    const contentPreview = formattedContent.substring(0, 2500);
    const publishDate = new Date(post.date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const separator = "---";

    return `# ${post.title}

${post.description}

${separator}

${contentPreview}

[記事の全文を読む](${sourceUrl})

${separator}

## 📌 記事情報

**出典：** Openclaw Blog
**公開日：** ${publishDate}
**カテゴリ：** ${post.category}

---

## 🏷️ タグ

${tags}

---

このブログ記事はOpenclawの実務活用に関する記事です。
元の記事でより詳しい情報を確認できます。`;
  };

  const noteContent = generateNoteFormat();

  const handleCopy = () => {
    navigator.clipboard.writeText(noteContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleOpenNote = () => {
    // note.com の新規記事作成ページを開く
    window.open("https://note.com/create", "_blank");
  };

  return (
    <div className="mt-16 mb-12">
      {/* ヘッダーセクション */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent-purple/20 via-dark-card to-accent-indigo/10 border border-accent-purple/30 p-8 md:p-10">
        {/* 背景装飾 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent-purple/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-indigo/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

        {/* コンテンツ */}
        <div className="relative z-10">
          <div className="flex items-start gap-3 mb-6">
            <span className="text-4xl">📝</span>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-indigo mb-2">
                note.com で共有する
              </h3>
              <p className="text-dark-muted text-sm md:text-base">
                この記事をnote.comで共有しましょう。3ステップで完了します。
              </p>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {/* コピーボタン */}
            <button
              onClick={handleCopy}
              className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                isCopied
                  ? "bg-green-500/20 text-green-300 border border-green-500/50"
                  : "bg-gradient-to-r from-accent-purple to-accent-indigo text-white border border-accent-purple/50 hover:shadow-lg hover:shadow-accent-purple/50 hover:-translate-y-1"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isCopied ? (
                  <>
                    <span>✅</span>
                    <span>コピーしました！</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>テキストをコピー</span>
                  </>
                )}
              </span>
            </button>

            {/* note.com を開くボタン */}
            <button
              onClick={handleOpenNote}
              className="group relative px-6 py-3 rounded-xl font-semibold bg-dark-border hover:bg-dark-border/80 text-dark-text transition-all duration-300 border border-dark-border/50 hover:border-accent-purple/50 hover:shadow-lg hover:shadow-accent-purple/30 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                <span>📖</span>
                <span>note.com を開く</span>
              </span>
            </button>

            {/* プレビューボタン */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 border ${
                showPreview
                  ? "bg-accent-purple/20 text-accent-purple border-accent-purple/50"
                  : "bg-dark-border hover:bg-dark-border/80 text-dark-text border-dark-border/50 hover:border-accent-purple/50 hover:shadow-lg hover:shadow-accent-purple/30 hover:-translate-y-1"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span>👁️</span>
                <span>{showPreview ? "プレビュー中" : "プレビュー表示"}</span>
              </span>
            </button>
          </div>

          {/* プレビューセクション */}
          {showPreview && (
            <div className="mt-6 animate-in fade-in duration-300">
              <div className="bg-dark-bg/50 border border-dark-border/50 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-xs font-semibold text-dark-muted uppercase tracking-wider mb-3">
                  📄 プレビュー
                </p>
                <pre className="text-xs md:text-sm text-dark-muted whitespace-pre-wrap break-words font-mono overflow-auto max-h-80 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-dark-bg">
                  {noteContent}
                </pre>
              </div>
            </div>
          )}

          {/* 使い方ガイド */}
          <div className="mt-6 bg-dark-bg/40 border border-dark-border/30 rounded-xl p-5 backdrop-blur-xs">
            <p className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-3">
              🎯 3ステップで投稿
            </p>
            <ol className="space-y-2 text-sm text-dark-muted">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>
                  <span className="text-dark-text font-semibold">「テキストをコピー」</span>
                  をクリックして、記事をコピー
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>
                  <span className="text-dark-text font-semibold">「note.com を開く」</span>
                  をクリック（新規記事作成ページが開きます）
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-purple/20 text-accent-purple flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>
                  本文欄に貼り付けて、編集・投稿完了！
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
