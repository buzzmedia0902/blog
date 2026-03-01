import { getAllPosts } from "@/lib/markdown";
import { BlogListClient } from "@/components/BlogListClient";

export const metadata = {
  title: "Openclaw Blog - AI自動化のインサイト",
  description:
    "Openclawの実務活用に関するブログです。AIエージェント技術や自動化のインサイトをお届けします。",
};

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="bg-dark-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-dark-text mb-4">
            Openclaw Blog
          </h1>
          <p className="text-xl text-dark-muted">
            AIエージェント技術と自動化のインサイトをお届けします
          </p>
        </div>

        <BlogListClient initialPosts={posts} />
      </div>
    </div>
  );
}
