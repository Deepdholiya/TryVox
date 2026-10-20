import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

export const dynamic = "force-static";

/* Open to search engines and AI assistants alike: we want TryVox to be answerable in both. */
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Meta-ExternalAgent", "Bytespider", "cohere-ai", "DuckAssistBot", "MistralAI-User"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
