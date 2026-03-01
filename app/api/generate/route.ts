import { NextRequest, NextResponse } from "next/server";
import { orchestrateBlogGeneration } from "@/agents/orchestrator";
import { AgentInput } from "@/agents/types";

export async function POST(request: NextRequest) {
  try {
    // リクエストボディをパース
    const body = (await request.json()) as AgentInput;

    // 環境変数チェック
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // ブログ生成を実行
    const result = await orchestrateBlogGeneration(body);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          slug: result.slug,
          message: result.message,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
