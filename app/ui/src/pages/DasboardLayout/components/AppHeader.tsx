import RightToLeftGroup from "@/components/RightToLeftGroup";
import { Button, Flex } from "@mantine/core";

export default function AppHeader() {
  return (
    <Flex justify={`center`}>
      <RightToLeftGroup className="py-1">
        <Button size="compact-xs">Sign out</Button>
      </RightToLeftGroup>
    </Flex>
  );
}
