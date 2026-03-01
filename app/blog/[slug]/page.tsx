import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogPost } from "@/lib/types";
import { CategoryBadge } from "@/components/CategoryBadge";
import { NotePublishButton } from "@/components/NotePublishButton";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/markdown";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return {
      title: post.seoTitle,
      description: post.seoDescription,
      keywords: post.tags,
    };
  } catch {
    return {
      title: "記事が見つかりません",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  let post: BlogPost | null = null;
  let relatedPosts: BlogPost[] = [];
  let error: string | null = null;

  try {
    post = await getPostBySlug(slug);
    relatedPosts = await getRelatedPosts(slug, post.tags, 3);
  } catch (err) {
    error =
      err instanceof Error ? err.message : "記事の読み込みに失敗しました";
  }

  if (error || !post) {
    return (
      <div className="bg-dark-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark-muted mb-4">{error || "記事が見つかりません"}</p>
          <Link href="/" className="text-accent-purple hover:text-accent-indigo">
            ← ブログ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-dark-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="text-accent-purple hover:text-accent-indigo mb-8 inline-block">
          ← ブログ一覧に戻る
        </Link>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <CategoryBadge category={post.category} />
              <span className="text-dark-muted text-sm">{formattedDate}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-dark-text mb-4">
              {post.title}
            </h1>

            <p className="text-lg text-dark-muted mb-6">{post.description}</p>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 bg-dark-card border border-dark-border rounded-lg text-sm text-accent-purple hover:border-accent-purple transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="border-t border-dark-border pt-8 mb-12">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        <NotePublishButton post={post} />

        {relatedPosts.length > 0 && (
          <section className="border-t border-dark-border pt-12">
            <h2 className="text-2xl font-bold text-dark-text mb-6">
              関連する記事
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-dark-card border border-dark-border rounded-lg p-4 hover:border-accent-purple transition-all"
                >
                  <p className="text-sm text-dark-muted mb-2">
                    {new Date(relatedPost.date).toLocaleDateString("ja-JP", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="font-semibold text-dark-text group-hover:text-accent-purple transition-colors line-clamp-2">
                    {relatedPost.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
