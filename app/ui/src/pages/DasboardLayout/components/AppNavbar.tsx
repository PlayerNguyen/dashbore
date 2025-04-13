import {
  Box,
  Group,
  Input,
  NavLink,
  Stack,
  Text,
  type NavLinkProps,
} from "@mantine/core";
import { useLocation } from "@tanstack/react-router";
import { Search, Settings, SquareGanttChart, Users } from "lucide-react";
import { useMemo, useState } from "react";

export type AppNavbarLink = {
  id: string;
  url?: string;
  navLinkProps?: NavLinkProps;
  children?: AppNavbarLink[];
  keywords?: string[];
};

export default function AppNavbar() {
  const [searchValue, setSearchValue] = useState<string>("");
  const location = useLocation();

  const navlinks: AppNavbarLink[] = [
    {
      id: "overview",
      url: "/dashboard",
      navLinkProps: {
        label: (
          <Group gap={"xs"}>
            <SquareGanttChart size={14} />
            <Text size="xs">Overview</Text>
          </Group>
        ),
      },
    },
    {
      id: "system",
      navLinkProps: {
        label: (
          <Group gap={"xs"}>
            <Settings size={14} />
            <Text size="xs">System</Text>
          </Group>
        ),
      },
      children: [
        {
          id: "users",
          url: "/dashboard/users",
          navLinkProps: {
            label: (
              <Group gap={"xs"}>
                <Users size={12} />
                <Text size="xs">User management</Text>
              </Group>
            ),
          },
          keywords: ["users"],
        },
      ],
      keywords: ["system", "setting"],
    },
  ];

  const renderNavigationLinks = useMemo(
    () => (links: AppNavbarLink[]) => {
      return links.map((link) => (
        <NavLink
          key={link.id}
          href={link.url}
          {...link.navLinkProps}
          active={location.pathname === link.url}
        >
          {link.children &&
            link.children.length > 0 &&
            renderNavigationLinks(link.children)}
        </NavLink>
      ));
    },
    [searchValue, navlinks, location]
  );

  return (
    <Stack p={"sm"}>
      {/* Search input */}
      <Input
        leftSection={<Search size={14} />}
        size={"xs"}
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        placeholder="Search..."
      />

      {/* Navigation links */}
      <Box c={"gray.6"}>{renderNavigationLinks(navlinks)}</Box>
    </Stack>
  );
}
