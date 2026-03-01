import Anthropic from "@anthropic-ai/sdk";
import { AgentInput, PlannerOutput } from "./types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function planBlogPost(input: AgentInput): Promise<PlannerOutput> {
  const topic =
    input.topic ||
    "Openclawのワークフロー自動化について（デフォルトトピック）";
  const category = input.category || "PRACTICAL";
  const keywords = input.keywords || [
    "Openclaw",
    "自動化",
    "AI",
    "効率化",
  ];

  const prompt = `あなたはブログ企画のプロフェッショナルです。以下の情報に基づいて、Openclawの実務活用に関するブログ記事の企画を作成してください。

トピック: ${topic}
カテゴリ: ${category}
キーワード: ${keywords.join(", ")}

以下のJSON形式で出力してください：
{
  "title": "魅力的で検索最適化されたタイトル（50文字以内）",
  "description": "記事の説明（150文字程度）",
  "outline": ["見出し1", "見出し2", "見出し3", "見出し4"],
  "keywords": ["キーワード1", "キーワード2", ...],
  "category": "${category}"
}

タイトルは実務的で具体的であり、ユーザーにとって価値のある内容を表現してください。`;

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

  // JSONを抽出
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse planner response as JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    title: parsed.title,
    description: parsed.description,
    outline: parsed.outline,
    keywords: parsed.keywords,
    category: parsed.category,
  };
}
