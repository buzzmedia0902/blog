import Anthropic from "@anthropic-ai/sdk";
import { PlannerOutput, EditorOutput, SEOOutput } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateSEO(
  plan: PlannerOutput,
  content: EditorOutput
): Promise<SEOOutput> {
  const prompt = `あなたはSEOの専門家です。以下のブログ記事に基づいてSEOメタデータを生成してください。

タイトル: ${plan.title}
説明: ${plan.description}
記事本文:
${content.content}

以下のJSON形式で出力してください：
{
  "seoTitle": "検索結果に表示されるタイトル（50-60文字）",
  "seoDescription": "メタディスクリプション（120-160文字）",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"]
}

SEO最適化のポイント：
- タイトルにはメインキーワードを含める
- ディスクリプションは記事の価値を簡潔に説明
- タグはOpenclawに関連した実用的なもの
- ユーザーのクリックを促すような表現`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse SEO response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Generate slug from title
  const slug = plan.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 60);

  return {
    seoTitle: parsed.seoTitle,
    seoDescription: parsed.seoDescription,
    tags: parsed.tags,
    frontmatter: `---
title: "${plan.title}"
date: "${new Date().toISOString().split("T")[0]}"
category: "${plan.category}"
tags: [${parsed.tags.map((t: string) => `"${t}"`).join(", ")}]
description: "${plan.description}"
seo_title: "${parsed.seoTitle}"
seo_description: "${parsed.seoDescription}"
slug: "${slug}"
---`,
  };
}
