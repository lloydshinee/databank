import { getTopics } from "@/actions/topic.action";

export async function Topics({ reviewerId }: { reviewerId: string }) {
  const topics = await getTopics(reviewerId); // Fetch topics based on reviewer ID
  return (
    <div className="p-4 bg-gray-50">
      <h1 className="text-xl font-bold mb-3 text-gray-800">Topics</h1>
      <div className="space-y-4">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white border border-gray-200 rounded-md p-3"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {topic.title}
              </h2>
              {topic.description && (
                <p className="text-sm text-gray-600">{topic.description}</p>
              )}
              <div className="mt-2">
                {topic.subtopics.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {topic.subtopics.map((subtopic) => (
                      <li
                        key={subtopic.id}
                        className="pl-2 border-l border-gray-300"
                      >
                        <span className="font-medium">{subtopic.title}</span>
                        {subtopic.description && (
                          <p className="text-gray-500">
                            {subtopic.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No subtopics.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No topics available.</p>
        )}
      </div>
    </div>
  );
}
