"use client";

import { useState } from "react";
import { FormModal } from "@/components/FormModal";
import SubtopicForm from "@/components/forms/SubtopicForm";
import { TopicForm } from "@/components/forms/TopicForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Topic, Subtopic } from "@/lib/globals";

export function TopicTable({ data }: { data: Topic[] }) {
  const [visibleSubtopics, setVisibleSubtopics] = useState<
    Record<string, boolean>
  >({});

  const toggleSubtopics = (topicId: string) => {
    setVisibleSubtopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Topics</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((topic) => (
            <>
              {/* Topic Row */}
              <TableRow key={topic.id}>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{topic.description || "No description"}</TableCell>
                <TableCell>{topic.subtopics.length}</TableCell>
                <TableCell className="space-x-4">
                  <FormModal title="Edit">
                    <TopicForm reviewerId={topic.reviewerId} data={topic} />
                  </FormModal>
                  <FormModal title="Add Subtopic">
                    <SubtopicForm topicId={topic.id} />
                  </FormModal>
                  {topic.subtopics.length > 0 && (
                    <button
                      className="text-blue-500 underline"
                      onClick={() => toggleSubtopics(topic.id)}
                    >
                      {visibleSubtopics[topic.id]
                        ? "Hide Subtopics"
                        : "View Subtopics"}
                    </button>
                  )}
                </TableCell>
              </TableRow>

              {visibleSubtopics[topic.id] && topic.subtopics.length > 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="font-semibold mb-2">Subtopics</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topic.subtopics.map((subtopic: Subtopic) => (
                            <TableRow key={subtopic.id}>
                              <TableCell>{subtopic.title}</TableCell>
                              <TableCell>
                                {subtopic.description || "No description"}
                              </TableCell>
                              <TableCell>
                                <FormModal title="Edit">
                                  <SubtopicForm
                                    topicId={subtopic.topicId}
                                    data={subtopic}
                                  />
                                </FormModal>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
