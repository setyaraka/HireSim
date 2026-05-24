"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Send, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionCard, type InterviewQuestionView } from "./QuestionCard";
import { SessionProgress } from "./SessionProgress";
import { TranscriptEditor } from "./TranscriptEditor";
import { VoiceRecorder } from "./VoiceRecorder";

type SessionView = {
  id: string;
  targetRole: string;
  experienceLevel: string;
  interviewType: string;
  questions: Array<InterviewQuestionView & { answers: { id: string; score: number; feedback: unknown }[] }>;
};

export function InterviewRoom({ initialSession }: { initialSession: SessionView }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState(initialSession);
  const [question, setQuestion] = useState<InterviewQuestionView | null>(initialSession.questions.at(-1) ?? null);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = useMemo(() => session.questions.filter((item) => item.answers.length > 0).length, [session.questions]);

  async function loadSession() {
    const response = await fetch(`/api/interview/session/${session.id}`);
    const data = await response.json();
    if (response.ok) setSession(data.session);
  }

  async function generateQuestion() {
    setError("");
    setIsLoadingQuestion(true);
    const response = await fetch("/api/interview/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id })
    });
    const data = await response.json();
    setIsLoadingQuestion(false);
    if (!response.ok) {
      setError(data.error ?? "Unable to generate question.");
      return;
    }
    setQuestion(data.question);
    setTranscript("");
    await loadSession();
  }

  async function submitAnswer() {
    if (!question) return;
    setError("");
    if (transcript.trim().length < 5) {
      setError("Add a transcript before submitting your answer.");
      return;
    }
    setIsSubmitting(true);
    const response = await fetch("/api/interview/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id, questionId: question.id, transcript })
    });
    const data = await response.json();
    setIsSubmitting(false);
    if (!response.ok) {
      setError(data.error ?? "Unable to evaluate answer.");
      return;
    }
    sessionStorage.setItem(`feedback:${session.id}`, JSON.stringify(data.feedback));
    router.push(`/interview/${session.id}/feedback`);
  }

  useEffect(() => {
    const shouldContinue = searchParams.get("next") === "1";
    const currentQuestion = session.questions.at(-1);
    const currentQuestionIsAnswered = Boolean(currentQuestion?.answers.length);

    if (!question || (shouldContinue && currentQuestionIsAnswered)) {
      void generateQuestion();
    }
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">HireSim Interview</p>
          <h1 className="text-3xl font-semibold">{session.targetRole}</h1>
        </div>
        <Button variant="secondary" onClick={() => router.push("/dashboard")}>Dashboard</Button>
      </header>
      <SessionProgress current={Math.max(1, answeredCount + 1)} />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardContent className="pt-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/10">
                <UserRound className="text-cyan-200" />
              </div>
              <div>
                <p className="font-medium">Maya, AI Interviewer</p>
                <p className="text-sm text-slate-400">{session.interviewType.replace("_", " ").toLowerCase()}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <p>Answer naturally, then tighten the transcript before submitting. Specific examples beat polished generalities.</p>
              <p className="rounded-md bg-white/[0.04] p-3">Target level: {session.experienceLevel.replace("_", " ").toLowerCase()}</p>
            </div>
          </CardContent>
        </Card>
        <section className="space-y-5">
          {isLoadingQuestion && (
            <Card>
              <CardContent className="flex items-center gap-3 p-6 text-slate-300">
                <Loader2 className="animate-spin text-cyan-300" /> Generating your next question...
              </CardContent>
            </Card>
          )}
          {question && <QuestionCard question={question} />}
          <VoiceRecorder onTranscript={setTranscript} />
          <TranscriptEditor value={transcript} onChange={setTranscript} />
          {error && <div className="rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div>}
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={generateQuestion} disabled={isLoadingQuestion || isSubmitting}>Skip Question</Button>
            <Button onClick={submitAnswer} disabled={!question || isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {isSubmitting ? "Evaluating..." : "Submit Answer"}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
