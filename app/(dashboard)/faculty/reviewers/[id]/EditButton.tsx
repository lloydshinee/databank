"use client";

import { FormModal } from "@/components/FormModal";
import QuestionForm from "@/components/forms/QuestionForm";

export default function EditButton({ question }: { question: any }) {
  return (
    <div>
      <FormModal title="Edit Question">
        <QuestionForm reviewerId="" data={question} />
      </FormModal>
    </div>
  );
}
