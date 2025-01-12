import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || session.user.role !== "Admin") return <>Not Allowed</>;

  return <>{children}</>;
}
