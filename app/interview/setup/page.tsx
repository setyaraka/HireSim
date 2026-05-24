import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { InterviewSetupForm } from "@/components/interview/InterviewSetupForm";

export default function SetupPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto mb-6 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>
      <InterviewSetupForm />
    </main>
  );
}
