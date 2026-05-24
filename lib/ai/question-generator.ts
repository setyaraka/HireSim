import { z } from "zod";
import { AI_MODEL, assertAiConfigured, openai, parseCleanJson } from "./sumopod-client";
import { questionGeneratorSystem } from "./prompts";

export const generatedQuestionSchema = z.object({
  question: z.string(),
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  why_this_question: z.string(),
  expected_answer_focus: z.array(z.string())
});

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;

export async function generateInterviewQuestion(input: unknown): Promise<GeneratedQuestion> {
  assertAiConfigured();
  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.7,
    max_tokens: 1200,
    messages: [
      { role: "system", content: questionGeneratorSystem },
      { role: "user", content: JSON.stringify(input) }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return generatedQuestionSchema.parse(parseCleanJson(content));
}
