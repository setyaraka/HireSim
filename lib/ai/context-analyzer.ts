import { z } from "zod";
import { AI_MODEL, assertAiConfigured, openai, parseCleanJson } from "./sumopod-client";
import { contextAnalyzerSystem } from "./prompts";

export const contextAnalysisSchema = z.object({
  candidate_summary: z.string(),
  target_role_summary: z.string(),
  key_skills: z.array(z.string()),
  experience_highlights: z.array(z.string()),
  possible_risks: z.array(z.string()),
  interview_focus_areas: z.array(z.string())
});

export type ContextAnalysis = z.infer<typeof contextAnalysisSchema>;

export async function analyzeInterviewContext(input: unknown): Promise<ContextAnalysis> {
  assertAiConfigured();
  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.3,
    max_tokens: 1200,
    messages: [
      { role: "system", content: contextAnalyzerSystem },
      { role: "user", content: JSON.stringify(input) }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return contextAnalysisSchema.parse(parseCleanJson(content));
}
