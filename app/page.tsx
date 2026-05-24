import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, Mic, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: BrainCircuit, title: "Role-aware questions", text: "Questions adapt to your CV, job description, level, and previous answers." },
  { icon: Mic, title: "Voice-first practice", text: "Record answers in the browser and review the transcript before evaluation." },
  { icon: BarChart3, title: "Score and coaching", text: "Get a 1-10 score, strengths, gaps, and concrete steps toward a 9+ answer." },
  { icon: ShieldCheck, title: "Portfolio-ready stack", text: "Next.js, TypeScript, Prisma, PostgreSQL, Zod, Tailwind, and SumoPod AI." }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan-300 text-slate-950"><Sparkles size={18} /></span>
          HireSim
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden text-sm text-slate-300 hover:text-white sm:block">Dashboard</Link>
          <Link href="/interview/setup"><Button size="sm">Start Practice</Button></Link>
        </div>
      </nav>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3 py-1 text-sm text-cyan-100">
            <Sparkles size={14} /> Practice realistic interviews with AI
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            Turn your CV into a realistic interview room.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Upload your resume, paste the target job, answer tailored questions by voice, and get practical feedback that helps you sound clearer, sharper, and more convincing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/interview/setup"><Button size="lg">Start Practice <ArrowRight size={18} /></Button></Link>
            <Link href="/dashboard"><Button size="lg" variant="secondary">View Dashboard</Button></Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-cyan-300/10 blur-3xl" />
          <Card className="relative overflow-hidden">
            <CardContent className="space-y-5 p-5">
              <div className="rounded-lg border border-white/10 bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Current question</p>
                <p className="mt-2 text-xl font-semibold">Tell me about a challenging project where you owned the architecture.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Clarity", "Specificity", "Impact"].map((item, index) => (
                  <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-slate-400">{item}</p>
                    <p className="mt-2 text-2xl font-semibold text-cyan-200">{[8.4, 7.8, 8.9][index]}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
                <p className="text-sm font-medium text-cyan-100">Coach note</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">Lead with the business context, quantify the tradeoff, then explain your decision and measurable outcome.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-20 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardContent className="p-5">
              <feature.icon className="mb-4 text-cyan-300" />
              <h2 className="font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
