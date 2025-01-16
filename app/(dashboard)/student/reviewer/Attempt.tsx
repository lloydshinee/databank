import { getOngoingAttempt } from "@/actions/reviewerAttempt.action";
import { auth } from "@/auth";
import { FormModal } from "@/components/FormModal";
import { ReviewerAttemptForm } from "@/components/forms/ReviewerAttemptForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function Attempt({ reviewerId }: { reviewerId: string }) {
  const session = await auth();
  if (!session) return;

  const attempt = await getOngoingAttempt(session.user.id as string);

  return (
    <section className="p-4">
      {attempt ? (
        <Link href={`/attempt?attemptId=${attempt.id}`}>Continue Attempt</Link>
      ) : (
        <FormModal title="Attempt Reviewer">
          <ReviewerAttemptForm reviewerId={reviewerId} />
        </FormModal>
      )}
    </section>
  );
}
