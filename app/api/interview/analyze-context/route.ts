import { NextResponse } from "next/server";
import { analyzeInterviewContext } from "@/lib/ai/context-analyzer";

export async function POST(request: Request) {
  try {
    const analysis = await analyzeInterviewContext(await request.json());
    return NextResponse.json({ analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to analyze context.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
