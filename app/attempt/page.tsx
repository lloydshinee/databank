import { Suspense } from "react";
import { ReviewerAttempt } from "./ReviewerAttempt";
import Header from "@/components/Header";
import { TabVisibilityProvider } from "@/context/TabVisibilityContext";

export default function AttemptPage() {
  return (
    <main>
      <section className="p-6">
        <Header title="Reviewer Attempt" />
      </section>
      <Suspense fallback={<>Loading</>}>
        <TabVisibilityProvider>
          <ReviewerAttempt />
        </TabVisibilityProvider>
      </Suspense>
    </main>
  );
}
