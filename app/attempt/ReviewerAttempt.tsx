"use client";
import { useSearchParams } from "next/navigation";
import { AttemptProvider } from "@/providers/AttemptProvider";
import { AttemptQuestions } from "./AttemptQuestions";
import { AttemptScopes } from "./AttemptScopes";
import { AttemptScore } from "./AttemptScore";
import TabbedOutWarning from "./TabbedOutWarning";
import { useTabVisibility } from "@/context/TabVisibilityContext";


export function ReviewerAttempt() {
  const { isWarningShown } = useTabVisibility();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  if (!attemptId) return;
  return (
    <AttemptProvider attemptId={attemptId}>
      <main className={`relative `}>
        <AttemptScore />
        <AttemptScopes />
        <AttemptQuestions />
        {isWarningShown && <TabbedOutWarning />}
      </main>
    </AttemptProvider>
  );
}
