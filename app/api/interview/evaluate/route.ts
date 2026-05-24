import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { evaluateAnswer } from "@/lib/ai/answer-evaluator";
import { evaluateRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const payload = evaluateRequestSchema.parse(await request.json());
    const session = await db.interviewSession.findUnique({
      where: { id: payload.sessionId },
      include: { questions: true }
    });
    const question = session?.questions.find((item) => item.id === payload.questionId);

    if (!session || !question) {
      return NextResponse.json({ error: "Session or question not found." }, { status: 404 });
    }

    const feedback = await evaluateAnswer({
      target_role: session.targetRole,
      experience_level: session.experienceLevel,
      interview_type: session.interviewType,
      job_description: session.jobDescription,
      cv_summary: session.contextAnalysis,
      cv_text_excerpt: session.cvText.slice(0, 10000),
      question: {
        text: question.question,
        category: question.category,
        difficulty: question.difficulty,
        expected_answer_focus: question.expectedAnswerFocus,
        why_this_question: question.whyThisQuestion
      },
      candidate_answer: payload.transcript
    });

    const answer = await db.interviewAnswer.create({
      data: {
        questionId: payload.questionId,
        transcript: payload.transcript,
        score: feedback.score,
        feedback
      }
    });

    return NextResponse.json({ answer, feedback });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to evaluate answer.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
