import { useAttempt } from "@/providers/AttemptProvider";
import React, { useRef, useState } from "react";
import ChoicesCircle from "./ChoicesCircle";
import { QuestionChoice, ReviewerAttemptQuestion } from "@/lib/globals";

interface ItemCardProps {
    q: ReviewerAttemptQuestion
}

export default function ItemCard({q}: ItemCardProps) {
  const { updateAnswer, attempt } = useAttempt();
  const circleRefs = useRef<
    Array<React.RefObject<{ clearCanvas: () => void }>>
  >([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const handleAnswerChange = async (
    questionId: string,
    userAnswer: string | null
  ) => {
    if (attempt?.status === "Ongoing") {
      setSelectedAnswer(userAnswer as "A" | "B" | "C" | "D");
      updateAnswer(questionId, userAnswer);
    }
  };
  const handleReset = async (questionId: string, userAnswer: string | null) => {
    if (attempt?.status !== "Ongoing") return;
    setSelectedAnswer(null);
    circleRefs.current.forEach((ref) => ref.current?.clearCanvas());
    updateAnswer(questionId, userAnswer);
  };
  return (
    <div className="flex gap-3">
      {" "}
      {q.question.choices.map((choice: QuestionChoice, idx: number) => {
        const ref = React.createRef<{
          clearCanvas: () => void;
        }>();
        circleRefs.current[idx] = ref;
        return (
          <ChoicesCircle
            key={choice.id + choice.index}
            isDisabled={selectedAnswer !== null}
            isSelected={selectedAnswer === choice.index}
            choice_index={choice.index}
            onComplete={() => handleAnswerChange(q.id, choice.index)}
            isAnswer={q.userAnswer === choice.index}
          />
        );
      })}
      <button
        className="bg-[#720000] rounded-xl px-10 py-1 text-white"
        onClick={() => handleReset(q.id, selectedAnswer)}
      >
        Reset
      </button>
    </div>
  );
}
