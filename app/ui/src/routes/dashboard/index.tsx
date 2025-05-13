import DashboardContent from "@/components/DashboardContent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardContent
      title="Overview"
      subtitle="This is the dashboard overview page."
    >
      <p>hello world</p>
    </DashboardContent>
  );
}
