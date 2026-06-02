import DashboardLayout from "@/pages/DasboardLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <>Not logged in</>;
  }

  return <DashboardLayout />;
}
