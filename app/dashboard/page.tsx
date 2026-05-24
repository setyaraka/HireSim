import Link from "next/link";
import { CalendarClock, Play, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export default async function DashboardPage() {
  const sessions = await db.interviewSession.findMany({
    orderBy: { createdAt: "desc" },
    include: { questions: { include: { answers: true } } },
    take: 20
  });

  const answers = sessions.flatMap((session) => session.questions.flatMap((question) => question.answers.map((answer) => ({ ...answer, category: question.category }))));
  const avgScore = average(answers.map((answer) => answer.score));
  const categoryScores = new Map<string, number[]>();
  answers.forEach((answer) => categoryScores.set(answer.category, [...(categoryScores.get(answer.category) ?? []), answer.score]));
  const rankedCategories = Array.from(categoryScores.entries()).map(([category, scores]) => ({ category, score: average(scores) })).sort((a, b) => b.score - a.score);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">HireSim Dashboard</p>
          <h1 className="text-4xl font-semibold">Practice history</h1>
        </div>
        <Link href="/interview/setup"><Button><Sparkles size={18} />New Practice</Button></Link>
      </header>
      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-sm text-slate-400">Average Score</p><p className="mt-2 text-3xl font-semibold">{avgScore ? avgScore.toFixed(1) : "0.0"}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-slate-400">Sessions</p><p className="mt-2 text-3xl font-semibold">{sessions.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-slate-400">Best Category</p><p className="mt-2 truncate text-2xl font-semibold">{rankedCategories[0]?.category ?? "None"}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-slate-400">Weakest Category</p><p className="mt-2 truncate text-2xl font-semibold">{rankedCategories.at(-1)?.category ?? "None"}</p></CardContent></Card>
      </section>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Session History</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.length === 0 && (
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-5 text-slate-300">No sessions yet. Start a practice interview to build your score history.</div>
          )}
          {sessions.map((session) => {
            const sessionAnswers = session.questions.flatMap((question) => question.answers);
            const sessionAverage = average(sessionAnswers.map((answer) => answer.score));
            return (
              <div key={session.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="font-medium">{session.targetRole}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-1"><CalendarClock size={14} />{new Date(session.createdAt).toLocaleDateString()}</span>
                    <span>{session.interviewType.replace("_", " ")}</span>
                    <span>{session.questions.length} questions</span>
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-cyan-100"><Trophy size={16} />{sessionAverage ? sessionAverage.toFixed(1) : "No score"}</div>
                <Link href={`/interview/${session.id}`}><Button variant="secondary" size="sm"><Play size={16} />Resume</Button></Link>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
}
