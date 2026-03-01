import "dotenv/config";
import { orchestrateBlogGeneration } from "./orchestrator";
import { AgentInput } from "./types";

async function main() {
  console.log("\n🚀 Openclaw Blog Auto-Writing System");
  console.log("=====================================\n");

  // 環境変数チェック
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ エラー: ANTHROPIC_API_KEY 環境変数が設定されていません");
    process.exit(1);
  }

  // サンプル入力
  const input: AgentInput = {
    topic: "Openclawでワークフロー自動化：実務で使える5つの活用法",
    category: "PRACTICAL",
    keywords: ["Openclaw", "自動化", "ワークフロー", "効率化"],
  };

  try {
    const result = await orchestrateBlogGeneration(input);

    if (result.success) {
      console.log("\n" + "=".repeat(50));
      console.log("✨ ブログ記事が正常に生成されました！");
      console.log("=".repeat(50));
      console.log(`📄 ファイル: content/posts/${result.slug}.md`);
      console.log(`📝 タイトル: content/posts/${result.slug}.mdを確認してください`);
    } else {
      console.error("\n" + "=".repeat(50));
      console.error("❌ エラーが発生しました");
      console.error("=".repeat(50));
      console.error(result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ 予期しないエラーが発生しました:");
    console.error(error);
    process.exit(1);
  }
}

main();
