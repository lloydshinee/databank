import { getTopics } from "@/actions/topic.action";
import { Reviewer as ReviewerType } from "@prisma/client";
import { TopicTable } from "./TopicTable";

export async function Topics({ reviewer }: { reviewer: ReviewerType }) {
  const topics = await getTopics(reviewer.id);

  return (
    <section>
      <TopicTable data={topics} />
    </section>
  );
}
