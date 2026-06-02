import { Card, Divider, Stack } from "@mantine/core";
import clsx from "clsx";
import LoginBoxContent from "./content";
import LoginBoxHeader from "./header";

export default function LoginBox() {
  return (
    <Card className="loginbox-overlay" w={500} withBorder>
      <Stack className={clsx("loginbox-container")}>
        <LoginBoxHeader />
        <Divider />
        <LoginBoxContent />
      </Stack>
    </Card>
  );
}
