"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  PlusCircle,
  Lock,
  Unlock,
} from "lucide-react";

// Sample Logs Data
const logs = [
  {
    action: "Edited a Question",
    user: "Gatot",
    date: "2025-02-06 10:00 AM",
    icon: <Edit size={18} />,
  },
  {
    action: "Added Question(s)",
    user: "Jane Smith",
    date: "2025-02-06 10:15 AM",
    icon: <PlusCircle size={18} />,
  },
  {
    action: "Locked a Question",
    user: "Admin",
    date: "2025-02-06 11:30 AM",
    icon: <Lock size={18} />,
  },
  {
    action: "Unlocked a Question",
    user: "Admin",
    date: "2025-02-06 11:30 AM",
    icon: <Unlock size={18} />,
  },
  {
    action: "Added a Topic",
    user: "David Wilson",
    date: "2025-02-06 01:00 PM",
    icon: <PlusCircle size={18} />,
  },
  {
    action: "Deleted a Subtopic",
    user: "Sophia Davis",
    date: "2025-02-06 01:30 PM",
    icon: <Lock size={18} />,
  },
];

// Pagination Settings
const ITEMS_PER_PAGE = 3;

export default function LogsTable() {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = logs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="w-10">#</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLogs.map((log, index) => (
            <TableRow key={index}>
              <TableCell>{log.icon}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          variant="outline"
        >
          <ChevronLeft size={18} className="mr-1" /> Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          variant="outline"
        >
          Next <ChevronRight size={18} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
