import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import https from "https";
import matter from "gray-matter";
import { OpenAI } from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CATEGORY_PROMPTS = {
  PRACTICAL:
    "Professional business automation and workflow concept art, modern minimalist design, gradient blue and purple, high quality, 1024x1024",
  TUTORIAL:
    "Step-by-step learning guide visualization, clean educational design, gradient cyan and teal, technical illustration, 1024x1024",
  INSIGHTS:
    "Data analytics and insights concept, abstract charts and graphs, gradient orange and gold, modern design, 1024x1024",
  CASE_STUDY:
    "Success story and achievement concept, growth graph visualization, gradient green and emerald, professional, 1024x1024",
  ANNOUNCEMENT:
    "Important announcement and news concept, vibrant design, gradient red and pink, attention-grabbing, 1024x1024",
};

function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {}); // 失敗時はファイルを削除
        reject(err);
      });
  });
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

    const parsed = matter(content);
    const data = parsed.data as any;

    const title = data.title;
    const category = data.category || "PRACTICAL";

    // Skip if thumbnail already exists
    const outputPath = path.join(thumbnailsDir, `${slug}.png`);
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipped (exists): ${slug}.png`);
      continue;
    }

    console.log(`🎨 Generating: ${slug}...`);

    try {
      // Generate prompt based on title and category
      const categoryPrompt =
        CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS] ||
        CATEGORY_PROMPTS.PRACTICAL;
      const prompt = `Create a professional blog thumbnail for the article titled "${title}". ${categoryPrompt}. Include subtle text hint of the topic. Modern, clean design.`;

      // Call DALL-E API
      const response = await client.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      if (!response.data[0].url) {
        throw new Error("No image URL returned from DALL-E");
      }

      // Download image
      await downloadImage(response.data[0].url, outputPath);
      console.log(`✅ Generated: ${slug}.png`);
    } catch (error) {
      console.error(`❌ Error generating ${slug}:`, error);
    }
  }

  console.log("✨ All thumbnails generated!");
}

generateThumbnails().catch(console.error);
