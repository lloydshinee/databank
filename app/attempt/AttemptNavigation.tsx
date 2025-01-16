import { Button } from "@/components/ui/button";
import { useAttempt } from "@/providers/AttemptProvider";
import { CheckCheckIcon, X } from "lucide-react";
import { AttemptTimer } from "./AttemptTimer";

export function AttemptNavigation() {
  const { filteredQuestions } = useAttempt();

  return (
    <section className="w-[10rem]">
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
              {q.question.correctAnswer == q.userAnswer ? (
                <CheckCheckIcon />
              ) : (
                <X />
              )}
            </div>
          </div>
        ))}
      </div>
      <Button className="my-10">Finish Attempt</Button>
      <AttemptTimer />
    </section>
  );
}
