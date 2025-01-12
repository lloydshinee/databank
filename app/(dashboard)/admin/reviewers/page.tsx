import ReviewerForm from "@/components/forms/ReviewerForm";
import Header from "@/components/Header";
import { Reviewers } from "./Reviewers";
import { Suspense } from "react";
import { FormModal } from "@/components/FormModal";

export default function AdminReviewersPage() {
  return (
    <main className="space-y-4">
      <Header title="Reviewers" />
      <FormModal title="Create Reviewer">
        <ReviewerForm />
      </FormModal>
      <Suspense fallback={<>Loading Reviewers</>}>
        <Reviewers />
      </Suspense>
    </main>
  );
}
