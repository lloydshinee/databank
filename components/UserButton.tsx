import { auth } from "@/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SignOutButton } from "./SignoutButton";

export async function UserButton() {
  const session = await auth();

  if (!session) return;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarFallback>
            {session?.user.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[15rem]">
        <DropdownMenuLabel>
          <div className="text-sm font-medium">{session?.user.email}</div>
          <div className="text-xs text-muted-foreground">
            {session?.user.role.charAt(0).toUpperCase() +
              session?.user.role.slice(1)}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <section className="w-full">
          <SignOutButton />
        </section>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
