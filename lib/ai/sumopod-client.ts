import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.SUMOPOD_API_KEY ?? "missing-sumopod-api-key",
  baseURL: "https://ai.sumopod.com/v1"
});

export const AI_MODEL = "gpt-4o-mini";

export function assertAiConfigured() {
  if (!process.env.SUMOPOD_API_KEY) {
    throw new Error("SUMOPOD_API_KEY is not configured.");
  }
}

export function parseCleanJson(content: string): any {
  let cleaned = content.trim();
  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n/i, "").replace(/\n```$/i, "").trim();
  }
  return JSON.parse(cleaned);
}
