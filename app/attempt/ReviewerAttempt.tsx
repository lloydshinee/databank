"use client";
import { getReviewerAttempt } from "@/actions/reviewerAttempt.action";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ReviewerAttempt() {
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [attempt, setAttempt] = useState<any>(null);

  const fetchAttempt = async () => {
    setAttempt(await getReviewerAttempt(attemptId as string));
  };

  useEffect(() => {
    fetchAttempt();
  }, []);

  return (
    <div>
      AttemptPage {attemptId}
      <pre>{JSON.stringify(attempt, null, 2)}</pre>
    </div>
  );
}
