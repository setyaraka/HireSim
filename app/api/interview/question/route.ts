import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateInterviewQuestion } from "@/lib/ai/question-generator";
import { questionRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const { sessionId } = questionRequestSchema.parse(await request.json());
    const session = await db.interviewSession.findUnique({
      where: { id: sessionId },
      include: { questions: { include: { answers: true }, orderBy: { order: "asc" } } }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    const previousAnswers = session.questions.map((question) => ({
      question: question.question,
      category: question.category,
      answer: question.answers[0]?.transcript,
      score: question.answers[0]?.score
    }));

    const generated = await generateInterviewQuestion({
      target_role: session.targetRole,
      experience_level: session.experienceLevel,
      interview_type: session.interviewType,
      job_description: session.jobDescription,
      cv_text: session.cvText.slice(0, 10000),
      context_analysis: session.contextAnalysis,
      previous_answers: previousAnswers
    });

    const question = await db.interviewQuestion.create({
      data: {
        sessionId,
        question: generated.question,
        category: generated.category,
        difficulty: generated.difficulty,
        whyThisQuestion: generated.why_this_question,
        expectedAnswerFocus: generated.expected_answer_focus,
        order: session.questions.length + 1
      }
    });

    return NextResponse.json({ question });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate question.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
