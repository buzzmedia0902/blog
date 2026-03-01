export type Category = "PRACTICAL" | "TUTORIAL" | "INSIGHTS" | "CASE_STUDY" | "ANNOUNCEMENT";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: Category;
  tags: string[];
  description: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
}

export interface BlogPostMetadata {
  title: string;
  date: string;
  category: Category;
  tags: string[];
  description: string;
  seo_title: string;
  seo_description: string;
  slug: string;
}

export interface GenerateRequest {
  topic?: string;
  category?: Category;
  keywords?: string[];
}

export interface BlogCardProps {
  slug: string;
  title: string;
  date: string;
  category: Category;
  description: string;
  tags: string[];
}
