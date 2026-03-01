import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import https from "https";
import matter from "gray-matter";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const CATEGORY_PROMPTS = {
  PRACTICAL:
    "Professional business automation and workflow concept, modern minimalist design with gradient blue and purple, corporate aesthetic, high quality. Optimized for 1280x670px - keep important elements in central area. Wide landscape format.",
  TUTORIAL:
    "Educational step-by-step learning guide, clean design with gradient cyan and teal, technical illustration, teaching style. Optimized for 1280x670px - keep important elements in central area. Wide landscape format.",
  INSIGHTS:
    "Data analytics and insights visualization, abstract charts and graphs, gradient orange and gold, modern infographic. Optimized for 1280x670px - keep important elements in central area. Wide landscape format.",
  CASE_STUDY:
    "Success story and achievement concept, growth visualization, gradient green and emerald, professional corporate style. Optimized for 1280x670px - keep important elements in central area. Wide landscape format.",
  ANNOUNCEMENT:
    "Important announcement and news concept, vibrant design, gradient red and pink, attention-grabbing modern aesthetic. Optimized for 1280x670px - keep important elements in central area. Wide landscape format.",
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
        fs.unlink(filepath, () => {});
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

    console.log(`🎨 Generating with Gemini 3.1 Flash Image: ${slug}...`);

    try {
      const categoryPrompt =
        CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS] ||
        CATEGORY_PROMPTS.PRACTICAL;

      const prompt = `Create a professional blog thumbnail for: "${title}". ${categoryPrompt}. Include subtle visual hint of the article topic. Modern, clean, professional design.`;

      // Use Gemini 3.1 Flash Image (Nano Banana 2) for image generation
      const model = client.getGenerativeModel({
        model: "gemini-3.1-flash-image-preview",
      });

      console.log(`📝 Prompt: ${prompt.substring(0, 80)}...`);

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

      // Extract image from response
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          const part = candidate.content.parts[0];

          // Check if it's an image part
          if ("inlineData" in part && part.inlineData) {
            const imageData = part.inlineData;
            if (
              imageData.mimeType === "image/png" ||
              imageData.mimeType === "image/jpeg"
            ) {
              // Decode base64 and save
              const buffer = Buffer.from(imageData.data, "base64");
              fs.writeFileSync(outputPath, buffer);
              console.log(`✅ Generated: ${slug}.png`);
              continue;
            }
          }
        }
      }

      // If no image, check response text
      const text = response.text();
      console.log(`⚠️  Response text: ${text.substring(0, 150)}`);
      console.log(
        `❌ No image in response for ${slug}. Response: ${text.substring(0, 100)}`
      );
    } catch (error) {
      console.error(`❌ Error generating ${slug}:`, error);
    }
  }

  console.log("✨ Gemini 3.1 Flash Image generation completed!");
}

generateThumbnails().catch(console.error);
