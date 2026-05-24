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
      job_description: session.jobDescription,
      cv_summary: session.contextAnalysis,
      question: question.question,
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
