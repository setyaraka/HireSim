"use client";

import { Textarea } from "@/components/ui/input";

export function TranscriptEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 text-sm font-medium">
      Transcript Review
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder="Your transcribed answer will appear here. You can edit it before submitting." />
    </label>
  );
}
