import QuestionsTable from "./QuestionsTable";

export default function Questions({ reviewerId }: { reviewerId: string }) {
  return (
    <div>
      <h1 className="font-bold pt-10 pb-5">Questions</h1>
      <QuestionsTable reviewerId={reviewerId} />
    </div>
  );
}
