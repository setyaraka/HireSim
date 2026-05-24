import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { InterviewRoom } from "@/components/interview/InterviewRoom";

export const dynamic = "force-dynamic";

export default async function InterviewPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await db.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: { answers: { orderBy: { createdAt: "desc" }, take: 1 } }
      }
    }
  });

  if (!session) notFound();

  return <InterviewRoom initialSession={JSON.parse(JSON.stringify(session))} />;
}
