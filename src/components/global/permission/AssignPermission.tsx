import { ModalInterface } from "@/src/interface/ModalInterface";
import { PermissionInterface } from "@/src/interface/PermissionInterface";
import { RoleInterface } from "@/src/interface/RoleInterface";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import CheckBox from "../form/CheckBox";
import Table from "../field/Table";
import { normalizeString } from "@/src/utils/utils";
import { getCSRFToken } from "@/src/utils/token";
import { useToasts } from "@/src/context/ToastContext";

const AssignPermission: React.FC<ModalInterface> = (props) => {
  const [rolePermissions, setRolePermissions] = React.useState<
    (RoleInterface & { permission: PermissionInterface | null })[]
  >([]);
  const [assignedRoles, setAssignedRoles] = React.useState<number[]>([]);

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const { addToast } = useToasts();

  const getRolePermissions = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          roles: (RoleInterface & { permission: PermissionInterface | null })[];
        }>(`${url}/permission/assignment`, {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
          params: { permission_id: props.id },
        });

        if (responseData.roles) {
          setRolePermissions(responseData.roles);
          setAssignedRoles(
            responseData.roles
              .filter((role) => role.permission !== null)
              .map((role) => role.id ?? 0)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const submitAssignPermission = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();

      const { token } = await getCSRFToken();

      if (user?.token && token) {
        const { data: responseData } = await axios.post(
          `${url}/permission/assignment`,
          { permission_id: props.id, role_ids: assignedRoles },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          props.toggleModal();

          addToast(
            "Permission Assigned",
            "Permission assigned successfully",
            "success"
          );
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the permission is being assigned.";

        addToast("Permission Error", message, "error");
      }
    }
  };

  const handleAssignedRoles = (id: number) => {
    setAssignedRoles((prev) => {
      if (prev.includes(id)) {
        const removedId = prev.filter((role) => role !== id);

        return removedId;
      } else {
        return [...prev, id];
      }
    });
  };

  const mappedRoles = rolePermissions.map((role) => {
    const isChecked = assignedRoles.includes(role.id ?? 0);

    return {
      role: normalizeString(role.role),
      assign: (
        <div className="flex flex-col items-start justify-center">
          <CheckBox
            isChecked={isChecked}
            onClick={() => handleAssignedRoles(role.id ?? 0)}
          />
        </div>
      ),
    };
  });

  React.useEffect(() => {
    getRolePermissions();
  }, [getRolePermissions]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
            p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full max-h-full my-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-green rounded-t-lg font-bold text-neutral-100">
          Assign Permission
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitAssignPermission(e)}
          className="w-full h-full p-2 flex flex-col items-start justify-center gap-4 overflow-hidden t:p-4"
        >
          <Table
            color="neutral"
            contents={mappedRoles}
            headers={["Role", "Assign"]}
          />
          <button className="w-full p-2 rounded-md bg-accent-green text-neutral-100 font-bold mt-2">
            Assign
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignPermission;
