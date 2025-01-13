import { FormModal } from "@/components/FormModal";
import QuestionsForm from "@/components/forms/QuestionsForm";
import QuestionsTable from "./QuestionsTable";

export default function Questions({ reviewerId }: { reviewerId: string }) {
  return (
    <div>
      <FormModal title="Import from Excel">
        <QuestionsForm reviewerId={reviewerId} />
      </FormModal>
      <h1 className="font-bold pt-10 pb-5">Questions</h1>
      <QuestionsTable reviewerId={reviewerId} />
    </div>
  );
}
