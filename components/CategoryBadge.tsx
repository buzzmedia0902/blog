import { Category } from "@/lib/types";

const categoryLabels: Record<Category, string> = {
  PRACTICAL: "実務活用",
  TUTORIAL: "チュートリアル",
  INSIGHTS: "インサイト",
  CASE_STUDY: "ケーススタディ",
  ANNOUNCEMENT: "お知らせ",
};

const categoryColors: Record<Category, string> = {
  PRACTICAL: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  TUTORIAL: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  INSIGHTS: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  CASE_STUDY: "bg-green-500/20 text-green-300 border-green-500/30",
  ANNOUNCEMENT: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
        categoryColors[category]
      }`}
    >
      {categoryLabels[category]}
    </span>
  );
}
