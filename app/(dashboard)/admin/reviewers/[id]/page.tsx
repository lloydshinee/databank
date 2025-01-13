import { getReviewer } from "@/actions/reviewer.action";
import { FormModal } from "@/components/FormModal";
import { TopicForm } from "@/components/forms/TopicForm";
import Header from "@/components/Header";
import { Topics } from "./Topics";
import Questions from "./Questions";
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
      <Header title={reviewer.title}></Header>
      <ReviewerBanner reviewer={reviewer} />
      <FormModal title="Add Topic">
        <TopicForm reviewerId={params.id} />
      </FormModal>
      <Topics reviewer={reviewer} />
      <Questions reviewerId={reviewer.id} />
    </main>
  );
}
