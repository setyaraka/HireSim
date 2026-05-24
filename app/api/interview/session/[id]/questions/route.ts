import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const questions = await db.interviewQuestion.findMany({
      where: { sessionId: id },
      orderBy: { order: "asc" },
      include: { answers: { orderBy: { createdAt: "desc" } } }
    });
    return NextResponse.json({ questions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load questions.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
