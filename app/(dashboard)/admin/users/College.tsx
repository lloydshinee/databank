"use client";

import { colleges } from "@/lib/globals";
import { useState } from "react";
import StudentsTable from "./StudentsTable";
import FacultyTable from "./FacultyTable";

export default function College() {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState("Student");

  return (
    <section className="p-4 space-y-7">
      <div className="flex flex-wrap w-full gap-4">
        {colleges.map((college, i) => (
          <div
            key={i}
            onClick={() =>
              setSelectedCollege(
                selectedCollege == college.name ? null : college.name
              )
            }
            className={`${
              selectedCollege == college.name ? "bg-primary text-white" : ""
            } p-4 rounded-md text-center cursor-pointer transition-all`}
          >
            <img src={college.image} className="h-20" />
            {college.shortname}
          </div>
        ))}
      </div>

      {/* User type selector (Student or Faculty) */}
      <div className="mt-4">
        <label className="mr-4">Select User Type:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
        </select>
      </div>

      {/* Display the correct table based on the selectedUser */}
      {selectedUser === "Student" && (
        <StudentsTable college={selectedCollege} />
      )}
      {selectedUser === "Faculty" && <FacultyTable college={selectedCollege} />}
    </section>
  );
}
