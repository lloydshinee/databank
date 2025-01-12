import { Separator } from "@/components/ui/separator";
import { User } from "next-auth";
import Image from "next/image";
import { SideLinks } from "./SideLinks";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { MenuIcon, ChevronLeftCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { auth } from "@/auth";

export function SideBar({ user }: { user: User }) {
  return (
    <div className="h-screen w-[18rem] bg-red-950 md:flex flex-col hidden max-h-screen overflow-y-auto">
      <div className="flex flex-col gap-8 items-center justify-center p-10">
        <Image src="/logo.png" alt="Logo" width={80} height={80} />
        <h1 className="font-bold text-lg text-white">
          St. Peter&apos;s College
        </h1>
        <Separator className="opacity-50" />
      </div>
      <div className="px-10">
        <SideLinks role={user.role} />
      </div>
      <div className="mt-auto w-full p-5 rounded-lg shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white rounded-sm text-red-950 font-bold flex items-center justify-center">
            <p className="text-xs text-center">{user.role.toUpperCase()}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-white/50 text-sm">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function SideNav() {
  const session = await auth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden text-primary"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 border-0 bg-red-950">
        <SheetHeader className="flex-row p-5 items-center justify-between">
          <SheetTitle className="text-primary-foreground">DATABANK</SheetTitle>
          <SheetClose asChild>
            <Button size="icon" variant="outline">
              <ChevronLeftCircle />
            </Button>
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex flex-col w-full max-h-screen">
          <div className="flex flex-col">
            <SideLinks role={session?.user.role!} />
          </div>
          <div className="mt-auto w-full p-5 rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white rounded-sm text-red-950 font-bold flex items-center justify-center">
                <p className="text-xs text-center">
                  {session?.user.role.toUpperCase()}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-white/50 text-sm">{session?.user.email}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
