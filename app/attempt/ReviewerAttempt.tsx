"use client";
import { getReviewerAttempt } from "@/actions/reviewerAttempt.action";
import { ReviewerAttempt as ReviewerAttemptType } from "@/lib/globals";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ReviewerAttempt() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [attempt, setAttempt] = useState<ReviewerAttemptType | null>(null);

  const fetchAttempt = async () => {
    setAttempt(await getReviewerAttempt(attemptId as string));
  };

  useEffect(() => {
    if (!attemptId) return;
    fetchAttempt();
  }, [attemptId]);

  return (
    <div>
      AttemptPage {attemptId}
      <pre>{JSON.stringify(attempt, null, 2)}</pre>
    </div>
  );
}
