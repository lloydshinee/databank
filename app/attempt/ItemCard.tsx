import { useAttempt } from "@/providers/AttemptProvider";
import React, { useRef, useState, useEffect } from "react";
import ChoicesCircle from "./ChoicesCircle";
import { QuestionChoice, ReviewerAttemptQuestion } from "@/lib/globals";

interface ItemCardProps {
  q: ReviewerAttemptQuestion;
}

export default function ItemCard({ q }: ItemCardProps) {
  const { updateAnswer, attempt } = useAttempt();
  const circleRefs = useRef<
    Array<
      React.RefObject<{
        clearCanvas: () => void;
        hasDrawing: () => boolean;
        forceRedraw: () => void;
      }>
    >
  >([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    circleRefs.current = Array(q.question.choices.length)
      .fill(null)
      .map((_, i) => circleRefs.current[i] || React.createRef());
  }, [q.question.choices]);

  useEffect(() => {
    if (q.userAnswer) {
      setSelectedAnswer(q.userAnswer);
    }
  }, [q.userAnswer]);

  const handleAnswerChange = async (
    questionId: string,
    userAnswer: string | null
  ) => {
    if (attempt?.status === "Ongoing") {
      setSelectedAnswer(userAnswer as "A" | "B" | "C" | "D");
      updateAnswer(questionId, userAnswer);
    }
  };

  const handleErase = () => {};

  const handleReset = async (questionId: string) => {
    if (attempt?.status !== "Ongoing") return;

    circleRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.forceRedraw();
      }
    });

    setSelectedAnswer(null);
    updateAnswer(questionId, null);
  };

  return (
    <div className="flex gap-3 items-center">
      {q.question.choices.map((choice: QuestionChoice, idx: number) => (
        <ChoicesCircle
          key={choice.id + choice.index}
          isDisabled={selectedAnswer !== null}
          isSelected={selectedAnswer === choice.index}
          choice_index={choice.index}
          onComplete={() => handleAnswerChange(q.id, choice.index)}
          isAnswer={q.userAnswer === choice.index}
          onErase={handleErase}
          ref={circleRefs.current[idx]}
        />
      ))}
      <button
        className="bg-[#720000] rounded-xl px-10 py-1 text-white"
        onClick={() => handleReset(q.id)}
      >
        Reset
      </button>
    </div>
  );
}
