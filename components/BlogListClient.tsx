"use client";

import { useState, useMemo } from "react";
import { BlogPost, Category } from "@/lib/types";
import { BlogList } from "./BlogList";
import { SearchFilter } from "./SearchFilter";

interface BlogListClientProps {
  initialPosts: BlogPost[];
}

export function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        search === "" ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === null || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, search, selectedCategory]);

  const handleFilterChange = (newSearch: string, newCategory: Category | null) => {
    setSearch(newSearch);
    setSelectedCategory(newCategory);
  };

  return (
    <>
      <SearchFilter onFilterChange={handleFilterChange} />

      <div className="mb-6 text-sm text-dark-muted">
        {filteredPosts.length}件の記事
      </div>
      <BlogList posts={filteredPosts} />
    </>
  );
}
