import { getProgramReviewer } from "@/actions/reviewer.action";
import { getAccount } from "@/actions/user.action";
import { auth } from "@/auth";
import Header from "@/components/Header";
import ReviewerBanner from "@/components/ReviewerBanner";
import { Topics } from "./Topics";
import { Attempt } from "./Attempt";
import { Attempts } from "./Attempts";

export default async function ReviewerPage() {
  const session = await auth();
  if (!session) return;
  const user = await getAccount(session.user.id as string);
  if (!user) return;
  const reviewer = await getProgramReviewer(user.program as string);

  if (!reviewer) return <>Reviewer not Found</>;

  return (
    <main className="space-y-5">
      <Header title={`${user.college} Reviewer`} />
      <ReviewerBanner reviewer={reviewer} />
      <Topics reviewerId={reviewer.id} />
      <Attempt reviewerId={reviewer.id} />
      <Attempts reviewerId={reviewer.id} studentId={user.schoolId as string} />
    </main>
  );
}
