import { useAuthWhoAmIQuery } from "@/api/hook/auth.api.hook";
import { useAuthStore } from "@/store/useAuthStore";
import { Center } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import LoginBox from "./components/LoginBox";

export default function Unauthenticated() {
  const { isAuthenticated, user, setAuthenticated, setUser } = useAuthStore();
  const [currentTokenValue] = useLocalStorage({ key: "token" });
  const { data, isPending, isError } = useAuthWhoAmIQuery(
    currentTokenValue !== null
  );

  useEffect(() => {
    if (!isError && data) {
      console.log(`[Authentication] Logged as ${data.data.user.name}`);
      setAuthenticated(true);
      setUser(data.data.user);
    }
  }, [data, isError]);

  // if (isPending) {
  //   return <>Loading</>;
  // }

  // Handle get who am i first
  if (isAuthenticated && user) {
    console.log(
      `[Layout] User is already logged in with the valid credential.`
    );
  }

  return (
    <Center className={"min-h-[100vh] min-w-[100vw]"}>
      <LoginBox />
    </Center>
  );
}
