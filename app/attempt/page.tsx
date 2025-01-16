import { Suspense } from "react";
import { ReviewerAttempt } from "./ReviewerAttempt";
import Header from "@/components/Header";

export default function AttemptPage() {
  return (
    <main>
      <section className="p-6">
        <Header title="Reviewer Attempt" />
      </section>
      <Suspense fallback={<>Loading</>}>
        <ReviewerAttempt />
      </Suspense>
    </main>
  );
}
