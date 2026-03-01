import Anthropic from "@anthropic-ai/sdk";
import { WriterOutput, EditorOutput } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function editBlogPost(
  content: WriterOutput
): Promise<EditorOutput> {
  const prompt = `あなたはテクニカルブログの校正・編集者です。以下のMarkdown形式の記事を校正してください。

記事内容：
${content.content}

校正内容：
1. 日本語の文法・表現を改善
2. 一貫性のない表現を統一
3. 構成や流れを改善（必要な場合）
4. 冗長な表現を削除
5. 読みやすさを向上
6. 誤字脱字をチェック
7. Markdown形式を保持

校正済みの記事をMarkdown形式で出力してください。フロントマターは不要です。`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const editedContent =
    message.content[0].type === "text" ? message.content[0].text : "";

  return {
    content: editedContent,
  };
}
