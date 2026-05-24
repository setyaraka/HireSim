import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdf-parser";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "CV PDF is required." }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
    }

    const parsed = await extractPdfText(file);
    return NextResponse.json({ parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to parse CV.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
