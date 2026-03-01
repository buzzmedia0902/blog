import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/markdown";
import { generateRSSFeed } from "@/lib/rss";

export async function GET(request: NextRequest) {
  try {
    const posts = await getAllPosts();

    // リクエストのURLからベースURLを取得
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    const rss = generateRSSFeed(posts, baseUrl);

    return new NextResponse(rss, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("RSS generation error:", error);
    return new NextResponse("RSS generation failed", { status: 500 });
  }
}
