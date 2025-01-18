"use client";
import { useSearchParams } from "next/navigation";
import { AttemptProvider } from "@/providers/AttemptProvider";
import { AttemptQuestions } from "./AttemptQuestions";
import { AttemptScopes } from "./AttemptScopes";
import { AttemptScore } from "./AttemptScore";

export function ReviewerAttempt() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  if (!attemptId) return;
  return (
    <AttemptProvider attemptId={attemptId}>
      <main>
        <AttemptScore />
        <AttemptScopes />
        <AttemptQuestions />
      </main>
    </AttemptProvider>
  );
}
