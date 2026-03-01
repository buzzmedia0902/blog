"use client";

import { useState } from "react";
import { BlogPost } from "@/lib/types";

interface NotePublishButtonProps {
  post: BlogPost;
}

export function NotePublishButton({ post }: NotePublishButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Markdown を簡易的にテキストに変換
  const convertMarkdownToText = (markdown: string): string => {
    return markdown
      .replace(/^### (.*?)$/gm, "$1") // H3
      .replace(/^## (.*?)$/gm, "$1") // H2
      .replace(/^# (.*?)$/gm, "$1") // H1
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)") // Links
      .replace(/^- /gm, "• ") // Bullets
      .trim();
  };

  // note.com 投稿フォーマット生成
  const generateNoteFormat = (): string => {
    const textContent = convertMarkdownToText(post.content);
    const tags = post.tags.map((tag) => `#${tag}`).join(" ");
    const sourceUrl = `https://blog.openclaw.io/blog/${post.slug}`;

    return `${post.title}

${post.description}

---

${textContent.substring(0, 2000)}...

---
出典: Openclaw Blog
${sourceUrl}

${tags}`;
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
    <div className="mt-12 p-6 bg-dark-card border border-dark-border rounded-lg">
      <h3 className="text-lg font-bold text-dark-text mb-4">
        📝 note.com に投稿
      </h3>

      <p className="text-dark-muted text-sm mb-4">
        この記事をnote.comで共有できます。下のボタンをクリックしてコピーし、note.comに貼り付けてください。
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={handleCopy}
          className="flex-1 px-4 py-2 bg-accent-purple hover:bg-accent-indigo text-white rounded-lg font-semibold transition-colors"
        >
          {isCopied ? "✅ コピーしました！" : "📋 テキストをコピー"}
        </button>

        <button
          onClick={handleOpenNote}
          className="flex-1 px-4 py-2 bg-dark-border hover:bg-dark-border/80 text-dark-text rounded-lg font-semibold transition-colors"
        >
          📖 note.com を開く
        </button>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex-1 px-4 py-2 bg-dark-border hover:bg-dark-border/80 text-dark-text rounded-lg font-semibold transition-colors"
        >
          {showPreview ? "👁️ 非表示" : "👁️ プレビュー"}
        </button>
      </div>

      {showPreview && (
        <div className="mt-4 p-4 bg-dark-bg border border-dark-border rounded-lg overflow-auto max-h-96">
          <pre className="text-sm text-dark-muted whitespace-pre-wrap break-words font-mono">
            {noteContent}
          </pre>
        </div>
      )}

      <div className="mt-4 p-3 bg-dark-bg border border-dark-border rounded text-sm text-dark-muted">
        <p className="font-semibold mb-2">📌 使い方:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>「テキストをコピー」をクリック</li>
          <li>「note.com を開く」をクリック（新規記事作成ページが開きます）</li>
          <li>本文欄に貼り付けて、編集・投稿</li>
        </ol>
      </div>
    </div>
  );
}
