"use client";

import { BlogPost } from "@/lib/types";
import { BlogCard } from "./BlogCard";

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-dark-muted text-lg">
          記事がまだ公開されていません。
        </p>
        <p className="text-dark-muted text-sm mt-2">
          近日公開予定です。お楽しみに！
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          slug={post.slug}
          title={post.title}
          date={post.date}
          category={post.category}
          description={post.description}
          tags={post.tags}
        />
      ))}
    </div>
  );
}
