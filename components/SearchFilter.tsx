"use client";

import { useState } from "react";
import { Category } from "@/lib/types";

interface SearchFilterProps {
  onFilterChange: (search: string, category: Category | null) => void;
}

const categories: Category[] = [
  "PRACTICAL",
  "TUTORIAL",
  "INSIGHTS",
  "CASE_STUDY",
  "ANNOUNCEMENT",
];

const categoryLabels: Record<Category, string> = {
  PRACTICAL: "実務活用",
  TUTORIAL: "チュートリアル",
  INSIGHTS: "インサイト",
  CASE_STUDY: "ケーススタディ",
  ANNOUNCEMENT: "お知らせ",
};

export function SearchFilter({ onFilterChange }: SearchFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange(value, selectedCategory);
  };

  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
    onFilterChange(search, category);
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="記事を検索..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-accent-purple transition-colors"
        />
        <span className="absolute right-3 top-3 text-dark-muted">🔍</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedCategory === null
              ? "bg-accent-purple text-white"
              : "bg-dark-card border border-dark-border text-dark-muted hover:border-accent-purple"
          }`}
        >
          すべて
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              handleCategoryChange(
                selectedCategory === category ? null : category
              )
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-accent-purple text-white"
                : "bg-dark-card border border-dark-border text-dark-muted hover:border-accent-purple"
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
    </div>
  );
}
