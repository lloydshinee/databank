import { useAttempt } from "@/providers/AttemptProvider";

export function AttemptScore() {
  const { attempt } = useAttempt();

  const score = attempt?.score;
  const totalPossibleScore = 2 * (attempt?.questions?.length || 0); // Assuming each question is worth 2 points
  const isPassed = (score as number) >= totalPossibleScore / 2;

  if (attempt?.status == "Ongoing") return;

  return (
    <div className="p-4">
      <div
        className={`flex justify-between items-center p-4 rounded-lg shadow-lg ${
          isPassed
            ? "bg-green-200 border-green-600 text-green-800"
            : "bg-red-200 border-red-600 text-red-800"
        } border-2`}
      >
        <div className="font-semibold text-lg">Score: {score}</div>
        <div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isPassed
                ? "bg-green-300 text-green-800"
                : "bg-red-300 text-red-800"
            }`}
          >
            {isPassed ? "Passed" : "Failed"}
          </span>
        </div>
      </div>
    </div>
  );
}
