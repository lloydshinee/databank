"use client";

import { colleges, College as CollegeType } from "@/lib/globals";
import { useState } from "react";

export default function College() {
  const [selectedCollege, setSelectedCollege] = useState<CollegeType | null>(
    null
  );

  return (
    <section>
      {colleges.map((college, i) => (
        <div>{college.shortname}</div>
      ))}
    </section>
  );
}
