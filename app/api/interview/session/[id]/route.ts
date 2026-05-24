import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await db.interviewSession.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: { answers: { orderBy: { createdAt: "desc" }, take: 1 } }
        }
      }
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
