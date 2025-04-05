import { auth } from "@/auth";
import { SideBar } from "@/components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const session = await auth();

  if (!session) {
    return redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <main className="h-screen flex ">
        <SideBar user={session.user} />
        <ScrollArea className="h-screen flex-1 p-10 w-full ">
          {children}
        </ScrollArea>
        
      </main>
    </SessionProvider>
  );
}
