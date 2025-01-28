import { useAttempt } from "@/providers/AttemptProvider";
import { AttemptNavigation } from "./AttemptNavigation";
import React from "react";
import ItemCard from "./ItemCard";

export function AttemptQuestions() {
  const { filteredQuestions, attempt } = useAttempt();

  return (
    <section className="p-10 gap-10 flex flex-wrap">
      <div className="flex-1">
        {filteredQuestions.length === 0 ? (
          <p>No questions available for the selected scope.</p>
        ) : (
          filteredQuestions.map((q, i) => {
            const isCorrect = q.userAnswer === q.question.correctAnswer;

            return (
              <div
                key={q.id}
                className="mb-4 p-4 border rounded"
                id={`${i + 1}`}
              >
                <div className="flex gap-2">
                  <span>{i + 1}.</span>
                  <p>{q.question.content}</p>
                </div>

                {/*KINI */}
                <div className="mt-2 ">
                  {q.question.choices.map((choice) => (
                    <div key={choice.id} className="mb-2">
                      <span className="mr-4 opacity-50">{choice.index}</span>
                      {/* <input
                        type="radio"
                        id={`choice-${choice.id}`}
                        name={`question-${q.id}`}
                        value={choice.index}
                        checked={q.userAnswer === choice.index}
                        disabled={attempt?.status !== "Ongoing"} // Disable input if not "Ongoing"
                        onChange={() => handleAnswerChange(q.id, choice.index)}
                      /> */}
                      <span className="ml-2">{choice.content}</span>
                    </div>
                  ))}
                  {attempt?.status == "Ongoing" && <ItemCard q={q} />}
                </div>
                {/*KINI */}

                {/* Show feedback and correct answer when status is not "Ongoing" */}
                {attempt?.status !== "Ongoing" && (
                  <div className="mt-2">
                    <p
                      className={`font-bold ${
                        isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isCorrect
                        ? "Your answer is correct."
                        : "Your answer is incorrect."}
                    </p>
                    <p className="text-green-700">
                      Correct Answer:{" "}
                      <span className="font-bold">
                        {q.question.choices.find(
                          (choice) => choice.index === q.question.correctAnswer
                        )?.content || "N/A"}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <AttemptNavigation />
    </section>
  );
}
