import { ActionIcon, AppShell, Divider, Menu, useMantineColorScheme } from "@mantine/core";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { LogOut, Moon, Settings, Sun, Cog, PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface AppNavbarFooterProps {
  compact: boolean;
  onToggleCompact: () => void;
}

export default function AppNavbarFooter({ compact, onToggleCompact }: AppNavbarFooterProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    queryClient.clear();
    router.navigate({ to: "/" });
  };

  const ThemeIcon = colorScheme === "dark" ? Sun : Moon;

  return (
    <AppShell.Section>
      <Divider />
      <Menu position="right-start" withinPortal>
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            color="gray"
            size={compact ? "md" : "lg"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              paddingBlock: compact ? 4 : 8,
            }}
          >
            <Cog size={compact ? 18 : 20} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<Settings size={14} />}>
            Settings
          </Menu.Item>

          <Menu.Item
            leftSection={compact ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            onClick={onToggleCompact}
          >
            {compact ? "Expand sidebar" : "Compact mode"}
          </Menu.Item>

          <Menu.Item
            leftSection={<ThemeIcon size={14} />}
            onClick={() => toggleColorScheme()}
          >
            {colorScheme === "dark" ? "Light mode" : "Dark mode"}
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<LogOut size={14} />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </AppShell.Section>
  );
}
