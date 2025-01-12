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
import { getStudents } from "@/actions/student.action";
import { FormModal } from "@/components/FormModal";
import UsersForm from "@/components/forms/UsersForm";
import UserForm from "@/components/forms/UserForm";

export default function StudentsTable({ college }: { college: string | null }) {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { students, totalCount } = await getStudents({
        college,
        search,
        page,
        limit: 5, // Define the limit per page
      });
      setStudents(students);
      setTotalPages(Math.ceil(totalCount / 5)); // Correctly calculate the totalPages
    } catch (error) {
      console.error("Error fetching students:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [college, page]);

  return (
    <div className="space-y-5">
      <FormModal title="Import From Excel">
        <UsersForm role="Student" />
      </FormModal>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search students"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to page 1 when searching
          }}
          className="w-full"
        />
        <Button onClick={fetchStudents} variant="ghost">
          Search
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>College</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  {student.firstName} {student.lastName}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.college}</TableCell>
                <TableCell>
                  <FormModal title="Edit">
                    <UserForm role="Student" data={student} />
                  </FormModal>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No students found.
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
