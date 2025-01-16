import { useAttempt } from "@/providers/AttemptProvider";
import { AttemptNavigation } from "./AttemptNavigation";

export function AttemptQuestions() {
  const { filteredQuestions, updateAnswer } = useAttempt();

  const handleAnswerChange = async (questionId: string, userAnswer: string) => {
    updateAnswer(questionId, userAnswer);
  };

  return (
    <section className="p-10 gap-10 flex flex-wrap">
      <div className="flex-1">
        {filteredQuestions.length === 0 ? (
          <p>No questions available for the selected scope.</p>
        ) : (
          filteredQuestions.map((q, i) => (
            <div key={q.id} className="mb-4 p-4 border rounded" id={`${i + 1}`}>
              <div className="flex gap-2">
                <span>{i + 1}.</span>
                <p>{q.question.content}</p>
              </div>
              <div className="mt-2">
                {q.question.choices.map((choice) => (
                  <div key={choice.id} className="mb-2">
                    <span className="mr-4 opacity-50">{choice.index}</span>
                    <input
                      type="radio"
                      id={`choice-${choice.id}`}
                      name={`question-${q.id}`}
                      value={choice.index}
                      checked={q.userAnswer === choice.index}
                      onChange={() => handleAnswerChange(q.id, choice.index)}
                    />
                    <label htmlFor={`choice-${choice.id}`} className="ml-2">
                      {choice.content}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <AttemptNavigation />
    </section>
  );
}
