import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function AttemptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
