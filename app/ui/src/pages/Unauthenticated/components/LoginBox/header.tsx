import { Flex, Text, Title } from "@mantine/core";
import clsx from "clsx";

export default function LoginBoxHeader() {
  /**
   * Generate a greeting lore based on the current time of day.
   * @returns A greeting lore that matches the current time of day.
   */
  const generateGreetingLore = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good morning 🌞";
    } else if (hours < 18) {
      return "Good afternoon 🌆";
    } else {
      return "Good evening 🌃";
    }
  };

  return (
    <Flex
      className={clsx("loginbox-header")}
      gap={"md"}
      justify={`start`}
      align={`center`}
    >
      <Title
        className={clsx("loginbox-title flex-1")}
        c={"deepGreen.9"}
        order={2}
      >
        Dashbore
      </Title>
      <Text fw={"bold"}>{generateGreetingLore()}</Text>
    </Flex>
  );
}
