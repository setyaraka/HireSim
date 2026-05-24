import { assertAiConfigured, openai } from "./sumopod-client";

export async function transcribeAudio(file: File) {
  assertAiConfigured();
  const model = process.env.SUMOPOD_TRANSCRIPTION_MODEL ?? "whisper-1";
  const response = await openai.audio.transcriptions.create({
    file,
    model
  });
  return response.text;
}
