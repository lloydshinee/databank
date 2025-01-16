import { useAttempt } from "@/providers/AttemptProvider";

export function AttemptScopes() {
  const { selectedScope, changeScope, attempt } = useAttempt();

  const scopes = attempt?.scopes;

  if (!scopes || scopes.length === 0) {
    return <div>No scopes available</div>;
  }

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scopes.map((scope) => {
          const isSelected =
            selectedScope.topicId === scope.topicId &&
            selectedScope.subtopicId === scope.subtopicId;

          return (
            <div
              key={scope.id}
              onClick={() =>
                changeScope(scope.topicId, scope.subtopicId || null)
              }
              className={`p-4 rounded-lg border cursor-pointer 
                ${
                  isSelected
                    ? "bg-blue-100 border-red-500"
                    : "bg-white border-gray-300"
                }
                hover:bg-blue-50 transition-all duration-200`}
            >
              <h3 className="font-medium text-lg">{scope.topic?.title}</h3>
              {scope.subtopic && (
                <p className="text-sm text-gray-500">{scope.subtopic?.title}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
