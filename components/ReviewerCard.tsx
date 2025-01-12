import { getCollege } from "@/lib/utils";
import { Reviewer } from "@prisma/client";

export function ReviewerCard({ reviewer }: { reviewer: Reviewer }) {
  const college = getCollege(reviewer.college);

  return (
    <div
      className="w-full rounded-md h-40 relative overflow-hidden flex cursor-pointer"
      style={{ backgroundColor: college?.color }}
    >
      <div className="flex-1 flex-row justify-center p-4">
        <p className="mt-auto text-white/50 mb-1">{reviewer.status}</p>
        <h1 className="text-white font-bold">{reviewer.title}</h1>
        <p className="text-sm text-white/40">
          {reviewer.college} - {reviewer.program}
        </p>
      </div>
      <img src={college?.image} className="h-44" />
    </div>
  );
}
