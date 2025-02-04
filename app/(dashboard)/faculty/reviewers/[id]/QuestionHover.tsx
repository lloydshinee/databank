import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function QuestionHover({ question }: { question: any }) {
  const topicTitle = question.subtopic
    ? question.subtopic.title
    : question.Topic?.title;

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="truncate w-48">{question.content}</div>
      </HoverCardTrigger>
      <HoverCardContent>
        {topicTitle && (
          <div>
            <strong>Topic:</strong> {topicTitle}
          </div>
        )}
        <div>
          <strong>Question:</strong> {question.content}
        </div>
        <div>
          <strong>Correct Answer:</strong> {question.correctAnswer}
        </div>
        <div>
          <strong>Points:</strong> {question.points}
        </div>
        <div>
          <strong>Choices:</strong>
          <ul>
            {question.choices.map((choice: any) => (
              <li key={choice.id}>
                <strong>{choice.index}.</strong> {choice.content}
              </li>
            ))}
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
