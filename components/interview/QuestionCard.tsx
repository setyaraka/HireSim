import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type InterviewQuestionView = {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  whyThisQuestion?: string | null;
  expectedAnswerFocus?: unknown;
  order: number;
};

export function QuestionCard({ question }: { question: InterviewQuestionView }) {
  const focus = Array.isArray(question.expectedAnswerFocus) ? question.expectedAnswerFocus : [];
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-200">
          <span>{question.category}</span>
          <span className="text-slate-600">/</span>
          <span>{question.difficulty}</span>
        </div>
        <h2 className="text-2xl font-semibold leading-tight">{question.question}</h2>
      </CardHeader>
      <CardContent>
        {focus.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-300">What a strong answer should cover</p>
            <div className="flex flex-wrap gap-2">
              {focus.map((item) => (
                <span key={String(item)} className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-slate-300">
                  {String(item)}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
