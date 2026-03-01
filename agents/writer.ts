import Anthropic from "@anthropic-ai/sdk";
import { PlannerOutput, WriterOutput } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function writeBlogPost(plan: PlannerOutput): Promise<WriterOutput> {
  const outlineMarkdown = plan.outline.map((item) => `- ${item}`).join("\n");

  const prompt = `あなたはOpenclawの実務活用に関するテクニカルブログライターです。以下の企画に基づいて、3000文字程度の日本語ブログ記事を執筆してください。

タイトル: ${plan.title}
説明: ${plan.description}
アウトライン:
${outlineMarkdown}

要件：
1. 日本語で自然な文章を書く
2. 実務的で具体的な内容
3. コード例やスクリーンショット参照が必要な場合は説明的に記載
4. Markdownフォーマット（見出しはH2で開始）
5. 2500〜3500文字程度
6. 読みやすいように段落を適切に分ける
7. 最後に「まとめ」セクションを含める

記事本文を、見出し（H2）から始めてMarkdown形式で出力してください。フロントマターは不要です。`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = message.content[0].type === "text" ? message.content[0].text : "";

  return {
    content,
  };
}
