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
    <section className="p-8 bg-gray-50">
      <div className="w-full max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        {attempt ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Continue Your Attempt
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              You are almost there! Continue your review attempt by clicking the
              button below.
            </p>
            <Link
              href={`/attempt?attemptId=${attempt.id}`}
              className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
            >
              Continue Attempt
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Start a New Review Attempt
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              No ongoing attempts found. Please fill out the form below to start
              a new review attempt.
            </p>
            <FormModal title="Attempt Reviewer">
              <ReviewerAttemptForm reviewerId={reviewerId} />
            </FormModal>
          </div>
        )}
      </div>
    </section>
  );
}
