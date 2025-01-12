import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <section className="w-full h-screen flex">
      <Loader2Icon className="animate-spin m-auto" />
    </section>
  );
}
