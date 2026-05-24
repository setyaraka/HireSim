"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackCard, type Feedback } from "@/components/interview/FeedbackCard";

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams<{ sessionId: string }>();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`feedback:${params.sessionId}`);
    if (stored) setFeedback(JSON.parse(stored));
  }, [params.sessionId]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Answer Feedback</p>
          <h1 className="text-3xl font-semibold">Your coaching report</h1>
        </div>
        <Link href="/dashboard"><Button variant="secondary">Dashboard</Button></Link>
      </div>
      {feedback ? (
        <FeedbackCard feedback={feedback} />
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-slate-300">No feedback found in this browser session.</div>
      )}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={() => router.push(`/interview/${params.sessionId}`)}><RotateCcw size={18} />Try Again</Button>
        <Button onClick={() => router.push(`/interview/${params.sessionId}`)}>Continue to Next Question <ArrowRight size={18} /></Button>
      </div>
    </main>
  );
}
