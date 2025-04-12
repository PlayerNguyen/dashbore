import { Group, type GroupProps } from "@mantine/core";

interface RightToLeftGroupProps extends GroupProps {
  children: React.ReactNode;
}

export default function RightToLeftGroup({
  children,
  ...props
}: RightToLeftGroupProps) {
  return (
    <Group justify={"flex-end"} flex={1} {...props}>
      {children}
    </Group>
  );
}
