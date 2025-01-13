import { getProgramReviewer } from "@/actions/reviewer.action";
import { getAccount } from "@/actions/user.action";
import { auth } from "@/auth";
import Header from "@/components/Header";
import ReviewerBanner from "@/components/ReviewerBanner";

export default async function ReviewerPage() {
  const session = await auth();
  if (!session) return;
  const user = await getAccount(session.user.id as string);
  if (!user) return;
  const reviewer = await getProgramReviewer(user.program as string);

  return (
    <main className="space-y-5">
      <Header title={`${user.college} - ${user.program} Reviewer`} />
      {reviewer ? (
        <ReviewerBanner reviewer={reviewer} />
      ) : (
        "Your program doesn't have a reivewer"
      )}
    </main>
  );
}
