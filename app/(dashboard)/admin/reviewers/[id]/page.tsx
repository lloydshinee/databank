import { getReviewer } from "@/actions/reviewer.action";
import { FormModal } from "@/components/FormModal";
import { TopicForm } from "@/components/forms/TopicForm";
import Header from "@/components/Header";
import { Topics } from "./Topics";
import Questions from "./Questions";
import ReviewerBanner from "@/components/ReviewerBanner";
import { Attempts } from "./Attempts";
import EditRequestsTable from "@/app/(dashboard)/faculty/reviewers/[id]/EditRequestsTable";
import LogsTable from "./LogsTable";

export default async function ReviewerPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) return;

  const reviewer = await getReviewer(params.id);
  if (!reviewer) return;

  return (
    <main className="space-y-12 ">
      <Header title={reviewer.title}></Header>
      <ReviewerBanner reviewer={reviewer} />
      <FormModal title="Add Topic">
        <TopicForm reviewerId={params.id} />
      </FormModal>
      <Topics reviewer={reviewer} />
      <Questions reviewerId={reviewer.id} />
      <Attempts reviewerId={reviewer.id} />
      <section>
        <h1 className="font-bold mb-4">Edit Requests</h1>
        <EditRequestsTable reviewerId={reviewer.id} />
      </section>
      <section>
        <h1 className="font-bold mb-4">Logs</h1>
        <LogsTable reviewerId={reviewer.id} />
      </section>
    </main>
  );
}
