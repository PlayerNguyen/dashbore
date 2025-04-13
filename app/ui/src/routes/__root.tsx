import { useAuthWhoAmIQuery } from "@/api/hook/auth.api.hook";
import DashboardLayout from "@/pages/DasboardLayout";
import LoginBox from "@/pages/Unauthenticated/components/LoginBox";
import { useAuthStore } from "@/store/useAuthStore";
import { Center } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { createRootRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isAuthenticated, user, setAuthenticated, setUser } = useAuthStore();
  const [currentTokenValue] = useLocalStorage({ key: "token" });
  const { data, isPending, isError } = useAuthWhoAmIQuery(
    currentTokenValue !== null
  );
  console.log(`Current token: ${currentTokenValue}`);

  useEffect(() => {
    if (!isError && data) {
      console.log(`[Authentication] Logged as ${data.data.user.name}`);
      setAuthenticated(true);
      setUser(data.data.user);
      redirect({ to: "/dashboard" });
    }
  }, [data, currentTokenValue, isError]);

  if (!currentTokenValue) {
    return (
      <Center className={"min-h-[100vh] min-w-[100vw]"}>
        <LoginBox />
      </Center>
    );
  }

  // Handle get who am i first
  if (isAuthenticated && user) {
    console.log(
      `[Layout] User is already logged in with the valid credential.`
    );
  }

  return <DashboardLayout />;
}
