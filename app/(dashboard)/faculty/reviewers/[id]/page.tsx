import { getReviewer } from "@/actions/reviewer.action";
import AttemptsTable from "@/app/(dashboard)/admin/reviewers/[id]/AttemptsTable";
import Questions from "@/app/(dashboard)/admin/reviewers/[id]/Questions";
import { Topics } from "@/app/(dashboard)/admin/reviewers/[id]/Topics";
import { FormModal } from "@/components/FormModal";
import { TopicForm } from "@/components/forms/TopicForm";
import Header from "@/components/Header";
import ReviewerBanner from "@/components/ReviewerBanner";

export default async function ReviewerPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) return;

  const reviewer = await getReviewer(params.id);
  if (!reviewer) return;

  return (
    <main className="space-y-4">
      <Header title={reviewer.title} />
      <ReviewerBanner reviewer={reviewer} />
      <FormModal title="Add Topic">
        <TopicForm reviewerId={params.id} />
      </FormModal>
      <Topics reviewer={reviewer} />
      <Questions reviewerId={reviewer.id} />
      <section>
        <h1 className="font-bold mb-4">Attempts</h1>
        <AttemptsTable reviewerId={reviewer.id} />
      </section>
    </main>
  );
}
