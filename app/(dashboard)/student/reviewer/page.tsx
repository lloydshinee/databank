import { getProgramReviewer } from "@/actions/reviewer.action";
import { getAccount } from "@/actions/user.action";
import { auth } from "@/auth";
import Header from "@/components/Header";
import ReviewerBanner from "@/components/ReviewerBanner";
import { Topics } from "./Topics";
import { ReviewerAttemptForm } from "@/components/forms/ReviewerAttemptForm";
import { FormModal } from "@/components/FormModal";

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
      <FormModal title="Attempt Reviewer">
        <ReviewerAttemptForm reviewerId={reviewer.id} />
      </FormModal>
    </main>
  );
}
