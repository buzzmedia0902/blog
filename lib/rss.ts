import { BlogPost } from "./types";

export function generateRSSFeed(posts: BlogPost[], siteUrl: string): string {
  const baseUrl = siteUrl.replace(/\/$/, "");
  const rssDate = new Date().toUTCString();

  const itemsXml = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
      <author>Openclaw Blog</author>
      <content:encoded><![CDATA[
${generateContentEncoded(post)}
      ]]></content:encoded>
    </item>
  `
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Openclaw Blog</title>
    <link>${baseUrl}</link>
    <description>AIエージェント技術と自動化のインサイト</description>
    <language>ja</language>
    <lastBuildDate>${rssDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <title>Openclaw Blog</title>
      <url>${baseUrl}/logo.png</url>
      <link>${baseUrl}</link>
    </image>
    ${itemsXml}
  </channel>
</rss>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateContentEncoded(post: BlogPost): string {
  // Markdownを簡易的にHTMLに変換
  let html = post.content
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    .replace(/^\- (.*?)$/gm, "<li>$1</li>")
    .replace(/(<li>.*?<\/li>)/s, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|u|p|l])(.+)$/gm, "<p>$1</p>");

  return escapeXml(html);
}
