import { NavLink, Tooltip } from "@mantine/core";
import type { AppNavbarLink } from "@/types/sidebar";
import { useLocation } from "@tanstack/react-router";
import { useMemo } from "react";

interface AppNavbarLinkGroupProps {
  links: AppNavbarLink[];
  searchValue: string;
  compact: boolean;
}

function matchLink(link: AppNavbarLink, searchValue: string): boolean {
  const q = searchValue.toLowerCase();
  const labelMatch = link.label.toLowerCase().includes(q);
  const keywordMatch =
    link.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false;
  const childMatch =
    link.children?.some((c) => matchLink(c, searchValue)) ?? false;
  return labelMatch || keywordMatch || childMatch;
}

export default function AppNavbarLinkGroup({ links, searchValue, compact }: AppNavbarLinkGroupProps) {
  const location = useLocation();

  const items = useMemo(() => {
    if (!searchValue.trim()) return links;
    return links.filter((link) => matchLink(link, searchValue));
  }, [links, searchValue]);

  return items.map((link) => <AppNavbarLinkItem key={link.id} link={link} location={location} searchValue={searchValue} compact={compact} />);
}

interface AppNavbarLinkItemProps {
  link: AppNavbarLink;
  location: ReturnType<typeof useLocation>;
  searchValue: string;
  compact: boolean;
}

function AppNavbarLinkItem({ link, location, searchValue, compact }: AppNavbarLinkItemProps) {
  const Icon = link.icon;
  const isActive = link.url ? location.pathname === link.url : false;
  const hasChildren = link.children && link.children.length > 0;

  const navLink = (
    <NavLink
      href={link.url}
      label={compact ? undefined : link.label}
      leftSection={Icon ? <Icon size={compact ? 18 : 14} /> : undefined}
      active={isActive}
      childrenOffset={compact ? 0 : undefined}
      {...link.navLinkProps}
      style={compact ? { display: "flex", justifyContent: "center", ...(link.navLinkProps?.style || {}) } : link.navLinkProps?.style}
    >
      {hasChildren && !compact && (
        <AppNavbarLinkGroup
          links={link.children!}
          searchValue={searchValue}
          compact={compact}
        />
      )}
    </NavLink>
  );

  if (compact) {
    return (
      <Tooltip label={link.label} position="right" withArrow>
        {navLink}
      </Tooltip>
    );
  }

  return navLink;
}
