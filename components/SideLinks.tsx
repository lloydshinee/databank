"use client";

import { AdminLinks, FacultyLinks, StudentLinks } from "@/lib/links";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideLinks({ role }: { role: string }) {
  const pathname = usePathname();
  let links;

  switch (role) {
    case "Admin":
      links = AdminLinks;
      break;
    case "Student":
      links = StudentLinks;
      break;
    default:
      links = FacultyLinks;
      break;
  }

  return (
    <>
      {links.map((link, i) => {
        const isActive = pathname == link.href;
        return (
          <Link
            href={link.href}
            className={`p-4 rounded-lg text-primary-foreground  hover:bg-secondary transition-all flex gap-4 cursor-pointer ${
              isActive
                ? "font-semibold"
                : "hover:text-primary-foreground opacity-80"
            }`}
            key={i}
          >
            <link.icon />
            {link.tag}
          </Link>
        );
      })}
    </>
  );
}
