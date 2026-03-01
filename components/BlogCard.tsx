"use client";

import Link from "next/link";
import { BlogCardProps } from "@/lib/types";
import { CategoryBadge } from "./CategoryBadge";

export function BlogCard({
  slug,
  title,
  date,
  category,
  description,
  tags,
  thumbnail,
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link href={`/blog/${slug}`}>
      <div className="group relative h-full bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-accent-purple transition-all duration-300 hover:shadow-lg hover:shadow-accent-purple/20 cursor-pointer flex flex-col">
        {thumbnail && (
          <div className="relative w-full h-40 bg-dark-border overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm text-dark-muted">{formattedDate}</span>
            <CategoryBadge category={category} />
          </div>

          <h3 className="text-xl font-bold text-dark-text mb-3 line-clamp-2 group-hover:text-accent-purple transition-colors">
            {title}
          </h3>

          <p className="text-dark-muted text-sm mb-4 line-clamp-3 h-[4.5rem]">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-dark-border rounded text-xs text-dark-muted hover:bg-accent-purple/30 transition-colors"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs text-dark-muted">
                +{tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-auto">
            <span className="text-dark-muted text-sm group-hover:text-accent-purple transition-colors">
              記事を読む
            </span>
            <span className="text-accent-purple group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
