import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScoreCard } from "./ScoreCard";

export type Feedback = {
  score: number;
  summary_feedback: string;
  strengths: string[];
  weaknesses: string[];
  improvement_to_score_9: string[];
  suggested_better_answer: string;
  communication_feedback: string;
  content_feedback: string;
  next_practice_tip: string;
};

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
      <ul className="space-y-2 text-sm text-slate-300">
        {items.map((item) => <li key={item} className="rounded-md bg-white/[0.04] p-3">{item}</li>)}
      </ul>
    </div>
  );
}

export function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <Card>
      <CardHeader>
        <ScoreCard score={feedback.score} />
        <p className="text-slate-300">{feedback.summary_feedback}</p>
      </CardHeader>
      <CardContent className="grid gap-5 md:grid-cols-2">
        <FeedbackList title="Strengths" items={feedback.strengths} />
        <FeedbackList title="Weaknesses" items={feedback.weaknesses} />
        <FeedbackList title="How to Reach 9+" items={feedback.improvement_to_score_9} />
        <div>
          <h3 className="mb-2 text-sm font-semibold text-white">Next Practice Tip</h3>
          <p className="rounded-md bg-white/[0.04] p-3 text-sm text-slate-300">{feedback.next_practice_tip}</p>
        </div>
        <div className="md:col-span-2">
          <h3 className="mb-2 text-sm font-semibold text-white">Suggested Better Answer</h3>
          <p className="whitespace-pre-wrap rounded-md border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">{feedback.suggested_better_answer}</p>
        </div>
      </CardContent>
    </Card>
  );
}
