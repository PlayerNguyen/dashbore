import { AppShell, Input, ScrollArea } from "@mantine/core";
import { Search } from "lucide-react";
import { useState } from "react";
import { sidebarItems } from "@/configs/configureSidebar";
import AppNavbarFooter from "./AppNavbarFooter";
import AppNavbarLinkGroup from "./AppNavbarLinkGroup";

interface AppNavbarProps {
  compact: boolean;
  onToggleCompact: () => void;
}

export default function AppNavbar({ compact, onToggleCompact }: AppNavbarProps) {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <>
      {!compact && (
        <AppShell.Section p={"sm"}>
          <Input
            leftSection={<Search size={14} />}
            size={"xs"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
            placeholder="Search..."
          />
        </AppShell.Section>
      )}

      <AppShell.Section grow component={ScrollArea}>
        <AppNavbarLinkGroup
          links={sidebarItems}
          searchValue={searchValue}
          compact={compact}
        />
      </AppShell.Section>

      <AppNavbarFooter compact={compact} onToggleCompact={onToggleCompact} />
    </>
  );
}
