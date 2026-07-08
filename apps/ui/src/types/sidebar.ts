import type { NavLinkProps } from "@mantine/core";
import type { LucideIcon } from "lucide-react";

export type AppNavbarLink = {
  id: string;
  url?: string;
  label: string;
  icon: LucideIcon;
  navLinkProps?: Omit<NavLinkProps, "label" | "children">;
  children?: AppNavbarLink[];
  keywords?: string[];
};
