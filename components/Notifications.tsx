import { BellIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { fetchNotifications } from "@/actions/notifications";
import { auth } from "@/auth";

export default async function Notifications() {
  const session = await auth();
  if (!session) return null;

  const notifications = await fetchNotifications(session.user.id as string);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative">
          <BellIcon className="text-primary" />
          {notifications.some((n) => !n.viewed) && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 h-96 overflow-y-auto">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id}>
              <Link href={notification.link} className="flex flex-col">
                <span className="text-sm">{notification.message}</span>
                <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>
            <div className="text-sm text-gray-500">No Notifications</div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
