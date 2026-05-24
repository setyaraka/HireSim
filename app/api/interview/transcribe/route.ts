import { NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/ai/transcription-service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
    }

    const transcript = await transcribeAudio(file);
    return NextResponse.json({ transcript });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to transcribe audio.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
