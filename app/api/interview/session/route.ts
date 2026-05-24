import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeInterviewContext } from "@/lib/ai/context-analyzer";
import { sessionFormSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const payload = sessionFormSchema.parse(await request.json());
    const contextAnalysis = await analyzeInterviewContext(payload);

    const session = await db.interviewSession.create({
      data: {
        targetRole: payload.targetRole,
        experienceLevel: payload.experienceLevel,
        jobDescription: payload.jobDescription,
        cvText: payload.cvText,
        interviewType: payload.interviewType,
        contextAnalysis,
        status: "ACTIVE"
      }
    });

    return NextResponse.json({ session, contextAnalysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create interview session.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const sessions = await db.interviewSession.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        questions: {
          include: { answers: true }
        }
      },
      take: 20
    });
    return NextResponse.json({ sessions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load sessions.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
