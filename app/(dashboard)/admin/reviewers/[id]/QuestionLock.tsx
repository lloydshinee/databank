"use client";

import React, { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { useSession } from "next-auth/react";
import { updateQuestionStatus } from "@/actions/question.action";

interface QuestionLockProps {
  questionId: string;
  status: string;
}

export default function QuestionLock({
  questionId,
  status,
}: QuestionLockProps) {
  const [lockStatus, setLockStatus] = useState<string>(status);
  const { data: session } = useSession();

  const toggleLockStatus = async () => {
    try {
      // Simulate API call to update lock status
      if (session?.user.role != "Admin") return;

      const newStatus = lockStatus === "Unlocked" ? "Locked" : "Unlocked";
      setLockStatus(newStatus);

      // Example API call (replace with your actual implementation)
      await updateQuestionStatus(questionId, newStatus);
      console.log(`Question ${questionId} status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Failed to update lock status:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleLockStatus}
      >
        {lockStatus === "Locked" ? (
          <Lock className="text-red-500" />
        ) : (
          <Unlock className="text-green-500" />
        )}
        <span className="text-xs">{lockStatus}</span>
      </div>
    </div>
  );
}
