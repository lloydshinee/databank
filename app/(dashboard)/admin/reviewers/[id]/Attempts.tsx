import AttemptsTable from "./AttemptsTable";

export async function Attempts({ reviewerId }: { reviewerId: string }) {
  return (
    <section className="space-y-2">
      <h1 className="font-bold">Attempts</h1>
      <AttemptsTable reviewerId={reviewerId} />
    </section>
  );
}
