import { useAuthLogin } from "@/api/hook/auth.api.hook";
import RightToLeftGroup from "@/components/RightToLeftGroup";
import { AuthValidation } from "@common/index";
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import clsx from "clsx";
import { DoorOpen } from "lucide-react";
import toast from "react-hot-toast";
import { z } from "zod";

export default function LoginBoxContent() {
  const { mutateAsync: loginAsync } = useAuthLogin();

  const form = useForm<z.infer<typeof AuthValidation.LoginSchema>>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(AuthValidation.LoginSchema),
  });

  const handleSubmit = async (
    values: z.infer<typeof AuthValidation.LoginSchema>
  ) => {
    const response = await loginAsync(values, {
      onSuccess: (data) => {
        localStorage.setItem("token", data.data.token);
        toast.success("Login successful");
      },
      onError: (error) => {
        toast.error(`Login failed. ${error.response?.data.error.message}.`);
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack
        className={clsx("loginbox-content")}
        gap={"md"}
        justify={`start`}
        align={`center`}
      >
        <TextInput
          w={"100%"}
          label="Email"
          placeholder="Email"
          {...form.getInputProps("email")}
        />
        <TextInput
          w={"100%"}
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />
        <RightToLeftGroup w={"100%"}>
          <Button
            leftSection={<DoorOpen size={"14"} />}
            size={"compact-sm"}
            type="submit"
          >
            Login
          </Button>
        </RightToLeftGroup>
      </Stack>
    </form>
  );
}
