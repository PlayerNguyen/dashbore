import type { AppNavbarLink } from "@/types/sidebar";
import { Settings, SquareGanttChart, Users } from "lucide-react";

export const sidebarItems: AppNavbarLink[] = [
  {
    id: "overview",
    url: "/dashboard",
    label: "Overview",
    icon: SquareGanttChart,
  },
  {
    id: "system",
    label: "System",
    icon: Settings,
    keywords: ["system", "setting"],
    children: [
      {
        id: "users",
        url: "/dashboard/users",
        label: "User management",
        icon: Users,
        keywords: ["users"],
      },
    ],
  },
];
