import { useAttempt } from "@/providers/AttemptProvider";
import { CheckCheckIcon, X } from "lucide-react";
import { AttemptTimer } from "./AttemptTimer";
import { FinishButton } from "./FinishButton";

export function AttemptNavigation() {
  const { filteredQuestions, attempt } = useAttempt();

  return (
    <section className="w-[10rem] space-y-4">
      <h1 className="text-sm font-semibold text-primary mb-5">Navigation</h1>
      <div className="flex gap-2 flex-wrap">
        {filteredQuestions.map((q, i) => (
          <div
            key={i + 1}
            className={`p-3 rounded-sm drop-shadow-md border-primary border-[1px] relative
              ${q.userAnswer ? "bg-primary text-white" : "bg-white"}`}
          >
            {i + 1}
            <div
              className={`absolute bottom-[-4px] right-[-8px] rounded-full ${
                q.question.correctAnswer == q.userAnswer
                  ? "bg-green-600"
                  : "bg-red-600"
              }`}
            >
              {attempt?.status != "Ongoing" && (
                <>
                  {q.question.correctAnswer == q.userAnswer ? (
                    <CheckCheckIcon />
                  ) : (
                    <X />
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <FinishButton />
      <AttemptTimer />
    </section>
  );
}
