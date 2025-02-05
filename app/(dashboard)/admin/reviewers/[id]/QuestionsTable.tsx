"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input"; // Assuming ShadCN input component
import { Button } from "@/components/ui/button"; // Assuming ShadCN button component
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table"; // ShadCN table components
import { getQuestions } from "@/actions/question.action"; // Assuming you have a function to fetch questions
import { FormModal } from "@/components/FormModal";
import QuestionForm from "@/components/forms/QuestionForm"; // Form to create/edit questions
import { AssignTopic } from "./AssignTopic";
import { Question } from "@/lib/globals";
import QuestionLock from "./QuestionLock";
import QuestionsForm from "@/components/forms/QuestionsForm";
import { EditRequest } from "@/app/(dashboard)/faculty/reviewers/[id]/EditRequestButton";
import QuestionHover from "@/app/(dashboard)/faculty/reviewers/[id]/QuestionHover";

export default function QuestionsTable({ reviewerId }: { reviewerId: string }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { questions, totalCount } = await getQuestions({
        reviewerId,
        search,
        page,
        limit: 5, // Define the limit per page
      });
      setQuestions(questions);
      setTotalPages(Math.ceil(totalCount / 5)); // Correctly calculate the totalPages
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <FormModal title="Create Question">
          <QuestionForm reviewerId={reviewerId} />
        </FormModal>
        <FormModal title="Import from Excel">
          <QuestionsForm reviewerId={reviewerId} />
        </FormModal>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search questions"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to page 1 when searching
          }}
          className="w-full"
        />
        <Button onClick={fetchQuestions} variant="ghost">
          Search
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Content</TableCell>
            <TableCell>Correct Answer</TableCell>
            <TableCell>Points</TableCell>
            <TableCell>Topic</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : questions.length > 0 ? (
            questions.map((question: Question) => (
              <TableRow key={question.id}>
                <TableCell>
                  <QuestionHover question={question} />
                </TableCell>
                <TableCell>{question.correctAnswer}</TableCell>
                <TableCell>{question.points}</TableCell>
                <TableCell>
                  <AssignTopic
                    reviewerId={question.reviewerId}
                    questionId={question.id}
                    questionStatus={question.status}
                    data={{
                      topicId: question.topicId,
                      subtopicId: question.subtopicId,
                    }}
                  />
                </TableCell>
                <TableCell className="flex gap-4">
                  {question.status == "Unlocked" ? (
                    <FormModal title="Edit Question">
                      <QuestionForm reviewerId={reviewerId} data={question} />
                    </FormModal>
                  ) : (
                    <EditRequest questionId={question.id} />
                  )}
                  <QuestionLock
                    reviewerId={reviewerId}
                    questionId={question.id}
                    status={question.status}
                    revalidate={fetchQuestions}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No questions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
