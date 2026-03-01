import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogPost, BlogPostMetadata } from "./types";

const postsDirectory = path.join(process.cwd(), "content", "posts");

async function ensurePostsDirectory() {
  try {
    await fs.mkdir(postsDirectory, { recursive: true });
  } catch (error) {
    console.error("Error creating posts directory:", error);
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  await ensurePostsDirectory();

  try {
    const files = await fs.readdir(postsDirectory);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    const posts = await Promise.all(
      mdFiles.map((file) => getPostBySlug(file.replace(".md", "")))
    );

    return posts.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filePath = path.join(postsDirectory, `${slug}.md`);

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsed = matter(fileContent);
    const data = parsed.data as unknown as BlogPostMetadata;
    const content = parsed.content;

    return {
      slug: data.slug || slug,
      title: data.title,
      date: data.date,
      category: data.category,
      tags: data.tags || [],
      description: data.description,
      seoTitle: data.seo_title,
      seoDescription: data.seo_description,
      content,
      thumbnail: data.thumbnail,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    throw new Error(`Post not found: ${slug}`);
  }
}

export async function getPostSlugs(): Promise<string[]> {
  await ensurePostsDirectory();

  try {
    const files = await fs.readdir(postsDirectory);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(".md", ""));
  } catch (error) {
    console.error("Error reading post slugs:", error);
    return [];
  }
}

export async function savePost(slug: string, content: string): Promise<void> {
  await ensurePostsDirectory();

  const filePath = path.join(postsDirectory, `${slug}.md`);
  try {
    await fs.writeFile(filePath, content, "utf-8");
    console.log(`Post saved: ${filePath}`);
  } catch (error) {
    console.error(`Error saving post ${slug}:`, error);
    throw new Error(`Failed to save post: ${slug}`);
  }
}

export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();

  const related = allPosts
    .filter((post) => post.slug !== currentSlug)
    .filter((post) => post.tags.some((tag) => tags.includes(tag)))
    .slice(0, limit);

  return related;
}
