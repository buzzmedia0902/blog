import { Category } from "@/lib/types";

export interface AgentInput {
  topic?: string;
  category?: Category;
  keywords?: string[];
}

export interface PlannerOutput {
  title: string;
  description: string;
  outline: string[];
  keywords: string[];
  category: Category;
}

export interface WriterOutput {
  content: string;
}

export interface EditorOutput {
  content: string;
}

export interface SEOOutput {
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  frontmatter: string;
}

export interface BlogGenerationResult {
  slug: string;
  markdown: string;
  success: boolean;
  message: string;
}
