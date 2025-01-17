import AttemptsTable from "./AttemptsTable";
import { Completion } from "./Completion";
import { Stats } from "./Stats";

export function Attempts({
  reviewerId,
  studentId,
}: {
  reviewerId: string;
  studentId: string;
}) {
  return (
    <div className="space-y-8">
      <div className="flex gap-4 justify-center">
        <Stats />
        <Completion />
      </div>
      <div>
        <h1 className="font-bold mb-4">Attempts</h1>
        <AttemptsTable reviewerId={reviewerId} userId={studentId} />
      </div>
    </div>
  );
}
