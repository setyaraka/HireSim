import { z } from "zod";
import { AI_MODEL, assertAiConfigured, openai, parseCleanJson } from "./sumopod-client";
import { answerEvaluatorSystem } from "./prompts";

export const answerFeedbackSchema = z.object({
  score: z.number().min(1).max(10),
  summary_feedback: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvement_to_score_9: z.array(z.string()),
  suggested_better_answer: z.string(),
  communication_feedback: z.string(),
  content_feedback: z.string(),
  next_practice_tip: z.string()
});

export type AnswerFeedback = z.infer<typeof answerFeedbackSchema>;

export async function evaluateAnswer(input: unknown): Promise<AnswerFeedback> {
  assertAiConfigured();
  const response = await openai.chat.completions.create({
    model: AI_MODEL,
    temperature: 0.25,
    max_tokens: 1600,
    messages: [
      { role: "system", content: answerEvaluatorSystem },
      { role: "user", content: JSON.stringify(input) }
    ],
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  return answerFeedbackSchema.parse(parseCleanJson(content));
}
