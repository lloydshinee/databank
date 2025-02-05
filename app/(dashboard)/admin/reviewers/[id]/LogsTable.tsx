"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getLogs } from "@/actions/log.action";

export default function LogsTable({ reviewerId }: { reviewerId: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { logs, totalCount } = await getLogs({
        reviewerId,
        page,
        limit: 3, // Define the limit per page
      });
      setLogs(logs);
      setTotalPages(Math.ceil(totalCount / 3)); // Correctly calculate the totalPages
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : logs.length > 0 ? (
            logs.map((log, index) => (
              <TableRow key={index}>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  <span className="p-1 rounded-full bg-slate-800 text-white mr-4">
                    {log.user.role}
                  </span>
                  {log.user.firstName}
                  <br></br>
                  {log.user.email}
                </TableCell>
                <TableCell>
                  {new Date(log.dateCreated).toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No logs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
