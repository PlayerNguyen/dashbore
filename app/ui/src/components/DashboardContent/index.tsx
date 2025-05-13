import { Group, Stack, Title } from "@mantine/core";
import clsx from "clsx";

export type DashboardContentProps = {
  children: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  actionButtons?: React.ReactNode | React.ReactNode[];
};

export default function DashboardContent({
  children,
  title,
  subtitle,
  actionButtons,
}: DashboardContentProps) {
  return (
    <Stack>
      {/* Header */}
      <Group p={"md"} bg={"gray.1"} c={"dark.6"}>
        <Stack gap={0} className={clsx(`flex-1`)}>
          <Title pb={0} mb={0}>
            {title}
          </Title>
          <Title order={4}>{subtitle}</Title>
        </Stack>
        <Group>{actionButtons}</Group>
      </Group>
      {/* Body */}
      {children}
    </Stack>
  );
}
