import { Wrench } from "lucide-react";

export default function Notice() {
  return (
    <div className="bg-blue-100 border border-blue-300 text-blue-900 rounded-md p-4 flex items-center space-x-4 shadow-sm">
      <Wrench className="w-6 h-6 text-blue-900" />
      <div>
        <h3 className="text-lg font-semibold">We&apos;re Still Building!</h3>
        <p>
          This area is under development as we strive to create the best
          experience for you. Thank you for your patience and support!
        </p>
      </div>
    </div>
  );
}
