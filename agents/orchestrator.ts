import Anthropic from "@anthropic-ai/sdk";
import { planBlogPost } from "./planner";
import { writeBlogPost } from "./writer";
import { editBlogPost } from "./editor";
import { generateSEO } from "./seo";
import { AgentInput, BlogGenerationResult } from "./types";
import { savePost } from "@/lib/markdown";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function orchestrateBlogGeneration(
  input: AgentInput
): Promise<BlogGenerationResult> {
  try {
    console.log("🎯 Orchestrator: ブログ生成を開始します");

    // Step 1: Plan
    console.log("📋 Step 1: Planner Agentが企画を作成中...");
    const plan = await planBlogPost(input);
    console.log(`✅ 企画完了: "${plan.title}"`);

    // Step 2: Write
    console.log("✍️  Step 2: Writer Agentが本文を執筆中...");
    const draftContent = await writeBlogPost(plan);
    console.log("✅ 執筆完了");

    // Step 3: Edit
    console.log("📝 Step 3: Editor Agentが校正中...");
    const editedContent = await editBlogPost(draftContent);
    console.log("✅ 校正完了");

    // Step 4: SEO
    console.log("🔍 Step 4: SEO Agentがメタデータを生成中...");
    const seoData = await generateSEO(plan, editedContent);
    console.log("✅ SEOメタデータ生成完了");

    // Step 5: Quality Check (by Orchestrator)
    console.log("🔎 Quality Check: 最終チェック中...");
    const qualityCheckPrompt = `以下のブログ記事のタイトルと内容について、品質チェックを行ってください。品質問題があれば指摘してください。なければ "OK" と返してください。

タイトル: ${plan.title}

本文の冒頭:
${editedContent.content.substring(0, 500)}...

JSON形式で返してください: { "status": "OK" | "NEEDS_REVISION", "notes": "..." }`;

    const qualityCheckMessage = await client.messages.create({
      model: "claude-opus-4-6-20250514",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: qualityCheckPrompt,
        },
      ],
    });

    const qualityCheckText =
      qualityCheckMessage.content[0].type === "text"
        ? qualityCheckMessage.content[0].text
        : "";
    const qualityCheckMatch = qualityCheckText.match(/\{[\s\S]*\}/);
    const qualityCheckJson = qualityCheckMatch
      ? qualityCheckMatch[0]
      : "{}";
    const qualityCheck = JSON.parse(qualityCheckJson);

    if (qualityCheck.status === "NEEDS_REVISION") {
      console.warn("⚠️  品質チェック警告:", qualityCheck.notes);
    } else {
      console.log("✅ 品質チェック合格");
    }

    // Step 6: Save to file
    console.log("💾 Step 5: ファイルを保存中...");
    const slug = seoData.frontmatter.match(/slug: "([^"]+)"/)?.[1] || "unknown";
    const markdownContent = `${seoData.frontmatter}\n\n${editedContent.content}`;

    await savePost(slug, markdownContent);
    console.log(`✅ ファイル保存完了: ${slug}.md`);

    return {
      slug,
      markdown: markdownContent,
      success: true,
      message: `ブログ記事 "${plan.title}" が正常に生成・保存されました。`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("❌ エラーが発生しました:", errorMessage);

    return {
      slug: "",
      markdown: "",
      success: false,
      message: `ブログ生成失敗: ${errorMessage}`,
    };
  }
}
