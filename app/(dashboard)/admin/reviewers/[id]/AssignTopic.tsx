"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTopics } from "@/actions/topic.action"; // Add an action to handle updates
import { Topic } from "@/lib/globals";
import { assignTopic } from "@/actions/question.action";

export function AssignTopic({
  questionId,
  reviewerId,
  data,
}: {
  questionId: string;
  reviewerId: string;
  data: { topicId: string | undefined; subtopicId: string | undefined };
}) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(
    undefined
  );
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | undefined>(
    undefined
  );

  // Fetch Topics based on reviewerId
  const fetchTopics = async () => {
    const fetchedTopics = await getTopics(reviewerId);
    setTopics(fetchedTopics);
  };

  // Effect to fetch topics on component mount
  useEffect(() => {
    fetchTopics();
  }, [reviewerId]);

  // Set the default selected topic and subtopic if they are provided in the data
  useEffect(() => {
    if (data.topicId) {
      setSelectedTopic(data.topicId);
    }
    if (data.subtopicId) {
      setSelectedSubtopic(data.subtopicId);
    }
  }, [data]);

  // Function to update topic and subtopic in the database
  const updateTopicAndSubtopic = async (
    topicId: string | undefined,
    subtopicId: string | undefined
  ) => {
    try {
      await assignTopic(questionId, { topicId, subtopicId }); // Properly pass parameters
      console.log("Topic and subtopic updated successfully.");
    } catch (error) {
      console.error("Error updating topic and subtopic:", error);
    }
  };

  // Effect to update topic when selectedTopic or selectedSubtopic changes
  useEffect(() => {
    if (selectedTopic !== null) {
      updateTopicAndSubtopic(selectedTopic, selectedSubtopic);
    }
  }, [selectedTopic, selectedSubtopic]);

  // Get the subtopics for the selected topic
  const selectedTopicData = topics.find((topic) => topic.id === selectedTopic);
  const subtopics = selectedTopicData?.subtopics || [];

  return (
    <div className="flex gap-4">
      {/* Topic Select */}
      <div>
        <Select
          value={selectedTopic || ""}
          onValueChange={(value) => {
            setSelectedTopic(value);
            setSelectedSubtopic(undefined); // Reset subtopic when topic changes
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic.id} value={topic.id}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {subtopics.length > 0 && (
        <div>
          <Select
            value={selectedSubtopic || ""}
            onValueChange={setSelectedSubtopic}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a subtopic" />
            </SelectTrigger>
            <SelectContent>
              {subtopics.map((subtopic) => (
                <SelectItem key={subtopic.id} value={subtopic.id}>
                  {subtopic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
