import { z } from "zod";

export const experienceLevels = ["FRESH_GRADUATE", "JUNIOR", "MID_LEVEL", "SENIOR"] as const;
export const interviewTypes = ["GENERAL_HR", "TECHNICAL", "BEHAVIORAL", "FOUNDER", "MIXED"] as const;

export const sessionFormSchema = z.object({
  targetRole: z.string().min(2, "Target role is required."),
  experienceLevel: z.enum(experienceLevels),
  jobDescription: z.string().min(20, "Paste a meaningful job description."),
  interviewType: z.enum(interviewTypes),
  cvText: z.string().min(20, "CV text is required.")
});

export const questionRequestSchema = z.object({
  sessionId: z.string().min(1)
});

export const evaluateRequestSchema = z.object({
  sessionId: z.string().min(1),
  questionId: z.string().min(1),
  transcript: z.string().min(5, "Transcript is too short to evaluate.")
});

export type SessionFormInput = z.infer<typeof sessionFormSchema>;
