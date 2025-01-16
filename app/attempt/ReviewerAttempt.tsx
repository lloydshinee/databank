"use client";
import { useSearchParams } from "next/navigation";
import { AttemptProvider } from "@/providers/AttemptProvider";
import { AttemptQuestions } from "./AttemptQuestions";
import { AttemptScopes } from "./AttemptScopes";

export function ReviewerAttempt() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  if (!attemptId) return;
  return (
    <AttemptProvider attemptId={attemptId}>
      <main>
        <AttemptScopes />
        <AttemptQuestions />
      </main>
    </AttemptProvider>
  );
}
