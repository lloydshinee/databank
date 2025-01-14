import { Suspense } from "react";
import { ReviewerAttempt } from "./ReviewerAttempt";

export default function AttemptPage() {
  return (
    <main>
      <Suspense fallback={<>Loading</>}>
        <ReviewerAttempt />
      </Suspense>
    </main>
  );
}
