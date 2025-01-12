import { BookAIcon, LayoutDashboard, User2 } from "lucide-react";

export const AdminLinks = [
  {
    tag: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    tag: "Reviewers",
    href: "/admin/reviewers",
    icon: BookAIcon,
  },
  {
    tag: "Users",
    href: "/admin/users",
    icon: User2,
  },
];

export const StudentLinks = [
  {
    tag: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
];

export const FacultyLinks = [
  {
    tag: "Dashboard",
    href: "/faculty/dashboard",
    icon: LayoutDashboard,
  },
];
