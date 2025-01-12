import { FormModal } from "@/components/FormModal";
import QuestionsForm from "@/components/forms/QuestionsForm";

export default function Questions({ reviewerId }: { reviewerId: string }) {
  return (
    <div>
      <FormModal title="Import from Excel">
        <QuestionsForm reviewerId={reviewerId} />
      </FormModal>
    </div>
  );
}
