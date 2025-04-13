import { Box, Skeleton } from "@mantine/core";
import clsx from "clsx";

export type ShimmeringProps = {
  /**
   * The content inside the shimmering when loaded.
   */
  children?: React.ReactElement;
  /**
   * The signal to display shimmering effect or not.
   */
  isLoading?: boolean;
};

export default function Shimmering({
  children,
  isLoading,
}: Readonly<ShimmeringProps>) {
  return (
    <Box
      className={clsx("shimmering-wrapper")}
      w={isLoading ? "100%" : "auto"}
      h={isLoading ? "100%" : "auto"}
      p={isLoading ? "sm" : 0}
    >
      <Skeleton w={"100%"} h={"100%"} animate visible={isLoading}>
        {children !== undefined ? children : "Hi"}
      </Skeleton>
    </Box>
  );
}
