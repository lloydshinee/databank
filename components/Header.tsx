import { BellIcon } from "lucide-react";
import { UserButton } from "./UserButton";
import { SideNav } from "./Sidebar";

export default function Header({ title }: { title: string }) {
  return (
    <section className="flex items-center justify-between py-4 border-b-2 mb-4">
      <h1 className="font-bold text-lg text-primary">{title}</h1>
      <div className="flex items-center gap-6">
        <BellIcon className="text-primary" />
        <UserButton />
        <SideNav />
      </div>
    </section>
  );
}
