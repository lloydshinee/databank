import { getCollege } from "@/lib/utils";
import { Reviewer } from "@prisma/client";

export default function ReviewerBanner({ reviewer }: { reviewer: Reviewer }) {
  const college = getCollege(reviewer.college);

  if (!college) return;

  return (
    <div
      className="flex items-center p-6 bg-white rounded-lg shadow-lg"
      style={{ borderLeft: `16px solid ${college.color}` }}
    >
      {/* College Image */}
      <img
        src={college.image}
        alt={college.name}
        className="w-16 h-16 rounded-full object-cover mr-6"
      />

      {/* Reviewer Info */}
      <div className="flex flex-col">
        <div className="text-2xl font-semibold">{reviewer.title}</div>
        <div className="text-sm text-gray-500">{reviewer.status}</div>
        <div className="text-sm mt-2">{reviewer.college}</div>
        <div className="text-sm text-gray-500">{college.shortname}</div>
      </div>
    </div>
  );
}
