import { useQueryGetAllUser } from "@/api/hook/user.api.hook";
import DashboardContent from "@/components/DashboardContent";
import {
  GetUserRequest,
  GetUserResponseEntity,
} from "@common/users.validation";
import { Button, Stack } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo } from "react";
import { z } from "zod";

export const Route = createFileRoute("/dashboard/users/")({
  component: RouteComponent,
  validateSearch: GetUserRequest,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data } = useQueryGetAllUser(search);

  const columns = useMemo<
    MRT_ColumnDef<z.infer<typeof GetUserResponseEntity>>[]
  >(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        header: "Action",
        columnDefType: "display",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: data?.data || [],
    manualPagination: true, // important for server-side pagination
    rowCount: data?.metadata.pagination.total ?? 0, // total number of rows
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      navigate({
        search: {
          ...search,
          page: newPagination.pageIndex + 1,
          limit: newPagination.pageSize,
        },
      });
    },
    state: {
      pagination: {
        pageIndex: (data?.metadata.pagination.page || 1) - 1,
        pageSize: data?.metadata.pagination.limit || 10,
      },
    },
  });

  return (
    <DashboardContent
      title={"Users"}
      subtitle={"Manage users"}
      actionButtons={<Button size="sm">Add User</Button>}
    >
      <Stack p={"md"}>
        <MantineReactTable table={table} />
      </Stack>
    </DashboardContent>
  );
}
