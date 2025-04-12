import { Center } from "@mantine/core";
import LoginBox from "./components/LoginBox";

export default function Unauthenticated() {
  return (
    <Center className={"min-h-[100vh] min-w-[100vw]"}>
      <LoginBox />
    </Center>
  );
}
