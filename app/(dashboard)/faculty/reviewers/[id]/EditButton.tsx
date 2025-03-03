"use client";

import { updateRequestStatus } from "@/actions/editRequest.action";
import { updateQuestionStatus } from "@/actions/question.action";
import { FormModal } from "@/components/FormModal";
import QuestionForm from "@/components/forms/QuestionForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

export default function EditButton({
  question,
  requestId,
}: {
  question: any;
  requestId: string;
}) {
  const { toast } = useToast();

  const handleLock = async () => {
    await updateQuestionStatus(question.id, "Locked");
    await updateRequestStatus(requestId, "Completed");

    toast({
      title: "Question Lock",
      description: "Successfulyy locked the question.",
    });
  };

  return (
    <div className="flex space-x-2">
      <FormModal title="Edit Question">
        <QuestionForm
          reviewerId={question.reviewerId as string}
          data={question}
        />
      </FormModal>

      <Button variant="outline" size="icon" onClick={handleLock}>
        <Lock />
      </Button>
    </div>
  );
}
