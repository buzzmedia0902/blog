import * as fs from "fs";
import * as path from "path";

const COLORS = {
  PRACTICAL: { bg: "#6366f1", accent: "#7c3aed" },
  TUTORIAL: { bg: "#06b6d4", accent: "#0891b2" },
  INSIGHTS: { bg: "#f59e0b", accent: "#d97706" },
  CASE_STUDY: { bg: "#10b981", accent: "#059669" },
  ANNOUNCEMENT: { bg: "#ef4444", accent: "#dc2626" },
};

function generateSVGThumbnail(
  title: string,
  category: keyof typeof COLORS
): string {
  const colors = COLORS[category];
  const lines = title.match(/.{1,30}/g) || [title];
  const textY = 315 - (lines.length * 40) / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0.8" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad)"/>

  <!-- Pattern overlay -->
  <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)"/>
  <circle cx="1100" cy="500" r="120" fill="rgba(255,255,255,0.1)"/>

  <!-- Title -->
  ${lines
    .map(
      (line, i) => `
    <text
      x="600"
      y="${textY + i * 80}"
      font-size="56"
      font-weight="700"
      text-anchor="middle"
      fill="white"
      font-family="system-ui, -apple-system, sans-serif"
    >
      ${line.trim()}
    </text>
  `
    )
    .join("")}

  <!-- Category badge -->
  <rect x="50" y="550" width="300" height="60" rx="8" fill="rgba(255,255,255,0.2)"/>
  <text
    x="70"
    y="588"
    font-size="32"
    font-weight="600"
    fill="white"
    font-family="system-ui, -apple-system, sans-serif"
  >
    Openclaw Blog
  </text>
</svg>`;
}

async function generateThumbnails() {
  const postsDir = path.join(process.cwd(), "content/posts");
  const thumbnailsDir = path.join(
    process.cwd(),
    "public/images/thumbnails"
  );

  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const slug = file.replace(".md", "");
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");

    const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
    const categoryMatch = content.match(/^category:\s*"([^"]+)"/m);

    if (!titleMatch || !categoryMatch) continue;

    const title = titleMatch[1];
    const category = categoryMatch[1] as keyof typeof COLORS;

    const svg = generateSVGThumbnail(title, category);
    const outputPath = path.join(thumbnailsDir, `${slug}.svg`);

    fs.writeFileSync(outputPath, svg);
    console.log(`✅ Generated: ${slug}.svg`);
  }

  console.log("✨ All thumbnails generated!");
}

generateThumbnails().catch(console.error);
