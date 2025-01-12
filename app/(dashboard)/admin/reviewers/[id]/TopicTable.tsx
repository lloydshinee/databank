"use client";

import { FormModal } from "@/components/FormModal";
import { TopicForm } from "@/components/forms/TopicForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Topic } from "@/lib/globals";

export function TopicTable({ data }: { data: Topic[] }) {
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
            <TableRow key={topic.id}>
              <TableCell>{topic.title}</TableCell>
              <TableCell>{topic.description || "No description"}</TableCell>
              <TableCell>{topic.Subtopic.length}</TableCell>
              <TableCell>
                <FormModal title="Edit">
                  <TopicForm reviewerId={topic.reviewerId} data={topic} />
                </FormModal>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
