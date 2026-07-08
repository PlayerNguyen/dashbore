import { AppShell } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import AppHeader from "./components/AppHeader";
import AppNavbar from "./components/AppNavbar";

export default function DashboardLayout() {
  const [compact, setCompact] = useState(false);

  return (
    <AppShell
      header={{ height: 40 }}
      navbar={{
        width: compact ? 60 : 200,
        breakpoint: "sm",
        collapsed: { mobile: true },
      }}
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppNavbar
          compact={compact}
          onToggleCompact={() => setCompact((c) => !c)}
        />
      </AppShell.Navbar>

      <AppShell.Main p={0} mih={"100vh"}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
