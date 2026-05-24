"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";

const experienceOptions = [
  ["FRESH_GRADUATE", "Fresh Graduate"],
  ["JUNIOR", "Junior"],
  ["MID_LEVEL", "Mid-Level"],
  ["SENIOR", "Senior"]
];

const interviewTypeOptions = [
  ["GENERAL_HR", "General HR"],
  ["TECHNICAL", "Technical"],
  ["BEHAVIORAL", "Behavioral"],
  ["FOUNDER", "Founder Interview"],
  ["MIXED", "Mixed"]
];

export function InterviewSetupForm() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("MID_LEVEL");
  const [jobDescription, setJobDescription] = useState("");
  const [interviewType, setInterviewType] = useState("MIXED");
  const [cvText, setCvText] = useState("");
  const [cvName, setCvName] = useState("");
  const [error, setError] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function parseCv(file?: File) {
    if (!file) return;
    setError("");
    setIsParsing(true);
    setCvName(file.name);
    const formData = new FormData();
    formData.append("cv", file);
    const response = await fetch("/api/interview/parse-cv", { method: "POST", body: formData });
    const data = await response.json();
    setIsParsing(false);
    if (!response.ok) {
      setError(data.error ?? "Unable to parse CV.");
      return;
    }
    setCvText(data.parsed.text);
  }

  async function submit() {
    setError("");
    if (!targetRole.trim() || !jobDescription.trim() || !cvText.trim()) {
      setError("Target role, job description, and CV PDF are required.");
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("/api/interview/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetRole, experienceLevel, jobDescription, interviewType, cvText })
    });
    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to create interview session.");
      return;
    }

    router.push(`/interview/${data.session.id}`);
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-300 text-slate-950">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Build your interview practice</h1>
            <p className="text-sm text-slate-400">HireSim will tailor questions from your CV and target job.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            Target Role
            <Input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="Senior Fullstack Engineer" />
          </label>
          <label className="space-y-2 text-sm font-medium">
            Experience Level
            <Select value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)}>
              {experienceOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            Interview Type
            <Select value={interviewType} onChange={(event) => setInterviewType(event.target.value)}>
              {interviewTypeOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </label>
          <label className="space-y-2 text-sm font-medium">
            CV PDF
            <div className="flex h-11 items-center gap-3 rounded-md border border-white/10 bg-slate-950/70 px-3">
              <FileText className="text-cyan-300" size={18} />
              <span className="min-w-0 flex-1 truncate text-sm text-slate-300">{cvName || "Upload PDF resume"}</span>
              {isParsing && <Loader2 className="animate-spin text-cyan-300" size={18} />}
              <input className="hidden" id="cv-upload" type="file" accept="application/pdf" onChange={(event) => parseCv(event.target.files?.[0])} />
              <label htmlFor="cv-upload" className="cursor-pointer text-sm text-cyan-200">Choose</label>
            </div>
          </label>
        </div>
        <label className="space-y-2 text-sm font-medium">
          Job Description
          <Textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here..." />
        </label>
        {cvText && (
          <div className="rounded-md border border-cyan-300/20 bg-cyan-300/5 p-3 text-sm text-cyan-100">
            CV parsed successfully: {Math.round(cvText.length / 5).toLocaleString()} estimated words extracted.
          </div>
        )}
        {error && <div className="rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100">{error}</div>}
        <Button className="w-full" size="lg" onClick={submit} disabled={isSubmitting || isParsing}>
          {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {isSubmitting ? "Analyzing CV and role..." : "Create Practice Session"}
        </Button>
      </CardContent>
    </Card>
  );
}
