import { getCollegeReviewers } from "@/actions/reviewer.action";
import { getAccount } from "@/actions/user.action";
import { auth } from "@/auth";
import Header from "@/components/Header";
import { ReviewerCard } from "@/components/ReviewerCard";
import Link from "next/link";

export default async function ReviewersPage() {
  const session = await auth();
  if (!session) return;
  const user = await getAccount(session.user.id as string);
  if (!user) return;
  const reviewers = await getCollegeReviewers(user.college as string);

  return (
    <main>
      <Header title={`${user.college} Reviewers`} />
      <section className="flex flex-col gap-4">
        {reviewers.map((rev) => (
          <Link key={rev.id} href={`reviewers/${rev.id}`}>
            <ReviewerCard reviewer={rev} />
          </Link>
        ))}
      </section>
    </main>
  );
}
