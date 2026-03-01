import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import matter from "gray-matter";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const CATEGORY_PROMPTS = {
  PRACTICAL:
    "Professional business automation and workflow concept art, modern minimalist design with gradient blue and purple, high quality, clean corporate aesthetic, 1024x1024",
  TUTORIAL:
    "Step-by-step learning guide visualization with clean educational design, gradient cyan and teal, technical illustration style, 1024x1024",
  INSIGHTS:
    "Data analytics and insights concept with abstract charts and graphs, gradient orange and gold, modern infographic design, 1024x1024",
  CASE_STUDY:
    "Success story and achievement concept with growth graph visualization, gradient green and emerald, professional corporate style, 1024x1024",
  ANNOUNCEMENT:
    "Important announcement and news concept with vibrant design, gradient red and pink, attention-grabbing modern style, 1024x1024",
};

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

    console.log(`🎨 Generating with Gemini: ${slug}...`);

    try {
      const categoryPrompt =
        CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS] ||
        CATEGORY_PROMPTS.PRACTICAL;

      const prompt = `Create a professional blog thumbnail for the article titled "${title}". ${categoryPrompt}. Include subtle text hint of the topic. Modern, clean design suitable for tech blog.`;

      // Use Gemini 2.0 Flash (or available image generation model)
      const model = client.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      const response = result.response;
      const text = response.text();

      // Check if image was generated
      if (text.includes("I can't") || text.includes("cannot")) {
        console.error(
          `❌ Gemini declined to generate: ${slug} - ${text.substring(0, 100)}`
        );
        continue;
      }

      // Gemini 2.0 Flash with imagen doesn't generate actual images in this API
      // It would need the specialized imagen-3 model which requires Vertex AI
      console.log(
        `⚠️  Note: Gemini API doesn't support direct image generation. Use Vertex AI Imagen instead.`
      );
      console.log(`Response: ${text.substring(0, 200)}`);
    } catch (error) {
      console.error(`❌ Error generating ${slug}:`, error);
    }
  }

  console.log("✨ Generation attempt completed!");
}

generateThumbnails().catch(console.error);
