import { AppShell } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";
import AppHeader from "./components/AppHeader";
import AppNavbar from "./components/AppNavbar";

export default function DashboardLayout() {
  return (
    <AppShell
      header={{ height: 40 }}
      navbar={{
        width: 200,
        breakpoint: "sm",
        // collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppNavbar />
      </AppShell.Navbar>

      <AppShell.Main bg={"dark.1"} p={0} mih={"100vh"}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
