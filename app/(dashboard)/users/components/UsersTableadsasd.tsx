"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import UserRoleBadge from "./UserRoleBadge";
import {
  Table,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export function UsersTabledasdsa({ data }: { data: any[] }) {
  const table = useReactTable({
    data,
    columns: [
      {
        header: "ID",
        accessorKey: "id",
      },
      {
        header: "Avatar",
        cell: ({ row }) => (
          <img
            src={row.original.avatar}
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full"
            loading="lazy"
          />
        ),
      },
      {
        header: "Nombre",
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Rol",
        /* cell: ({ row }) => <UserRoleBadge id={row.original.id} />, */
        accessorKey: "role",
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((h) => (
              <TableHead key={h.id}>
                {h.column.columnDef.header as any}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.map((r) => (
          <TableRow key={r.id}>
            {r.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
