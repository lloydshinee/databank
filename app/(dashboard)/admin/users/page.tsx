import Header from "@/components/Header";
import Link from "next/link";

export default function UsersPage() {
  return (
    <main>
      <Header title="Users" />
      <Link href="users/students">Manange Students</Link>
    </main>
  );
}
