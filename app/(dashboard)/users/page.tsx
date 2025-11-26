"use client";

import { useEffect, useState } from "react";
import { useUsersQuery } from "./hooks/useUsersQuery";
import {
  deleteUsers,
  updateUsersRoles,
  useAssignRoles,
} from "@/services/users.service";
import { DataTableDemo, User } from "./components/TestTable";
import CustomAlertDialog from "@/components/common/CustomAlertDialog";
import { toast } from "sonner";
import LoaderSpin from "@/components/common/LoaderSpin";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsersQuery(page);
  const [users, setUsers] = useState<User[]>(() => []);
  const [rowSelection, setRowSelection] = useState({});
  const [deletedUsersIds, setDeletedUsersIds] = useState<number[]>([]); // para simular persistencia en la eliminación de usuarios

  const [isOpen, setIsOpen] = useState(false);
  const [actionUsers, setActionUsers] = useState<User[]>([]);
  const [actionType, setActionType] = useState<"delete" | "changeRole" | null>(
    null
  );

  useEffect(() => {
    if (data?.data) {
      const assignedUsers = useAssignRoles(data.data);

      // Para simular persistencia en la eliminación de usuarios
      const filteredUsers = assignedUsers.filter(
        (user) => !deletedUsersIds.includes(user.id)
      );

      setUsers(filteredUsers);
    }
  }, [data]);

  function handlePageChange(page: number) {
    setPage(page);
  }

  function confirmChangeRole(users: User[]) {
    setActionUsers(users);
    console.log(users);
    setActionType("changeRole");
    setIsOpen(true);
  }

  function confirmDelete(users: User[]) {
    setActionUsers(users);
    setActionType("delete");
    setIsOpen(true);
  }

  function handleConfirmAction() {
    if (!actionType) return;

    // cerrar el diálogo
    setIsOpen(false);
    setActionUsers([]);
    setActionType(null);

    // Lo ideal aquí es eliminar los usuarios de la base de datos y de zustand, pero no se puede hacer con reqres
    toast.promise(
      new Promise<void>((resolve, reject) => {
        try {
          if (actionType === "delete") {
            // Eliminar usuarios seleccionados
            setUsers(users.filter((user) => !actionUsers.includes(user)));
            deleteUsers(actionUsers);

            // Se agrega el id del usuario a la lista de eliminados
            setDeletedUsersIds((ids) => [
              ...ids,
              ...actionUsers.map((u) => u.id),
            ]);

            setActionUsers([]);
            setRowSelection({});
          }

          if (actionType === "changeRole") {
            // Cambiar rol de usuarios
            const updatedUsers = updateUsersRoles(actionUsers);
            const newUsers = users.map((user) => {
              const findUser = updatedUsers.find((u) => u.id === user.id);
              return findUser ?? user;
            });
            setUsers(newUsers);
            console.log(newUsers);

            setActionUsers([]);
          }

          // Se finaliza la promesa
          resolve();
        } catch (err) {
          reject(err); // si algo falla
        }
      }),
      {
        loading:
          actionType === "delete"
            ? "Eliminando usuarios..."
            : "Cambiando rol...",
        success: `Usuarios ${
          actionType === "delete" ? "eliminados" : "cambiados"
        } con éxito`,
        error: `Error al ${
          actionType === "delete" ? "eliminar" : "cambiar el rol de "
        } usuarios`,
      }
    );
  }

  if (isLoading) return <LoaderSpin />;

  return (
    <>
      <DataTableDemo
        data={users as User[]}
        isLoading={isLoading}
        totalPages={data?.total_pages ?? 0}
        currentPage={page}
        onChangePage={handlePageChange}
        onChangeRole={confirmChangeRole}
        onDelete={confirmDelete}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

      <CustomAlertDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title={actionType === "delete" ? "Eliminar usuarios" : "Cambiar rol"}
        description={
          actionType === "delete"
            ? `¿Estás seguro de que quieres eliminar un total de ${actionUsers.length} usuarios?`
            : `¿Estás seguro de que quieres cambiar el rol de un total de ${actionUsers.length} usuarios? Se les cambiarán según su rol actual.`
        }
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
