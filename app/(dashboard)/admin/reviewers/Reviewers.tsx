import { getReviewers } from "@/actions/reviewer.action";
import { ReviewerCard } from "@/components/ReviewerCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function Reviewers() {
  const reviewers = await getReviewers();

  return (
    <section className="flex flex-col gap-4">
      {reviewers.map((rev) => (
        <Link key={rev.id} href={`reviewers/${rev.id}`}>
          <ReviewerCard reviewer={rev} />
        </Link>
      ))}
    </section>
  );
}
