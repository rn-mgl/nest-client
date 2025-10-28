"use client";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import BaseCard from "@/src/components/global/resource/BaseCard";
import ResourceActions from "@/src/components/global/resource/ResourceActions";
import CreateRole from "@/src/components/role/CreateRole";
import EditRole from "@/src/components/role/EditRole";
import {
  RESOURCE_ROLE_SEARCH,
  RESOURCE_ROLE_SORT,
} from "@/src/configs/filters";
import { useToasts } from "@/src/context/ToastContext";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { PermissionInterface } from "@/src/interface/PermissionInterface";
import { RoleInterface } from "@/src/interface/RoleInterface";
import { isUserSummary, normalizeString } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const Role = () => {
  const [roles, setRoles] = React.useState<
    (RoleInterface & { permissions: PermissionInterface[] | null })[]
  >([]);
  const [activeEditRole, setActiveEditRole] = React.useState(0);
  const [activeDeleteRole, setActiveDeleteRole] = React.useState(0);
  const [canCreateRole, setCanCreateRole] = React.useState(false);

  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const url = process.env.URL;

  const { addToast } = useToasts();

  const {
    canSeeSearchDropDown,
    toggleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
    search,
  } = useSearch("role", "Role");

  const {
    canSeeSortDropDown,
    toggleCanSeeSortDropDown,
    handleSelectSort,
    toggleAsc,
    sort,
  } = useSort("role", "Role");

  const canEdit = React.useMemo(() => {
    return user?.permissions.includes("update.role_resource");
  }, [user?.permissions]);

  const canDelete = React.useMemo(() => {
    return user?.permissions.includes("delete.role_resource");
  }, [user?.permissions]);

  const canManage = React.useMemo(() => {
    return canEdit || canDelete;
  }, [canEdit, canDelete]);

  const getRoles = React.useCallback(
    async (controller?: AbortController) => {
      try {
        if (user?.token && user.permissions.includes("read.role_resource")) {
          const { data: responseData } = await axios.get(
            `${url}/role/resource`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
              withCredentials: true,
              signal: controller?.signal,
            }
          );

          if (responseData.roles) {
            setRoles(responseData.roles);
          }
        }
      } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the roles are being retrieved";

          addToast("Role Error", message, "error");
        }
      }
    },
    [url, user?.token, user?.permissions, addToast]
  );

  const handleActiveEditRole = (id: number) => {
    setActiveEditRole((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDeleteRole = (id: number) => {
    setActiveDeleteRole((prev) => (prev === id ? 0 : id));
  };

  const handleCanCreateRole = () => {
    setCanCreateRole((prev) => !prev);
  };

  // format role first
  const formattedRoles = roles.map((role) => {
    const formattedRow = normalizeString(role.role);

    return {
      id: role.id,
      role: formattedRow,
      created_by: role.created_by,
      permissions: role.permissions,
    };
  });

  const mappedRoles = useFilterAndSort(formattedRoles, search, sort).map(
    (role) => {
      const createdBy = isUserSummary(role.created_by)
        ? role.created_by.first_name
        : null;

      const mappedPermissions = role.permissions?.map((permission) => {
        return (
          <div
            key={`permission-${permission.name}-${permission.id}`}
            className="bg-neutral-300 text-xs rounded-sm p-1 text-center break-inside-avoid"
          >
            {permission.name}
          </div>
        );
      });
      return (
        <BaseCard
          key={`role-${role.role}-${role.id}`}
          title={normalizeString(role.role)}
          createdBy={createdBy}
        >
          <div className="max-h-40 overflow-y-auto w-full min-h-40 h-full bg-neutral-200 rounded-md p-2">
            <div className="w-full columns-3 space-y-2 gap-2">
              {mappedPermissions}
            </div>
          </div>
          {canManage ? (
            <ResourceActions
              handleActiveEdit={
                canEdit ? () => handleActiveEditRole(role.id ?? 0) : null
              }
              handleActiveDelete={
                canDelete ? () => handleActiveDeleteRole(role.id ?? 0) : null
              }
            />
          ) : null}
        </BaseCard>
      );
    }
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getRoles(controller);

    return () => {
      controller.abort();
    };
  }, [getRoles]);

  return user?.permissions.includes("read.role_resource") ? (
    <div className="w-full flex flex-col items-center justify-start">
      {canCreateRole && user?.permissions.includes("create.role_resource") ? (
        <CreateRole toggleModal={handleCanCreateRole} refetchIndex={getRoles} />
      ) : null}

      {activeEditRole && user?.permissions.includes("update.role_resource") ? (
        <EditRole
          toggleModal={() => handleActiveEditRole(activeEditRole)}
          id={activeEditRole}
          refetchIndex={getRoles}
        />
      ) : null}

      {activeDeleteRole &&
      user?.permissions.includes("delete.role_resource") ? (
        <DeleteEntity
          route="role/resource"
          toggleModal={() => handleActiveDeleteRole(activeDeleteRole)}
          id={activeDeleteRole}
          label="Role"
          refetchIndex={getRoles}
        />
      ) : null}

      <div className="w-full flex flex-col items-start justify-start max-w-(--breakpoint-l-l) p-2 t:p-4 gap-4">
        <Filter
          searchKeyLabelPairs={RESOURCE_ROLE_SEARCH}
          search={{
            canSeeSearchDropDown: canSeeSearchDropDown,
            onChange: handleSearch,
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            selectSearch: handleSelectSearch,
            toggleCanSeeSearchDropDown: toggleCanSeeSearchDropDown,
          }}
          sortKeyLabelPairs={RESOURCE_ROLE_SORT}
          sort={{
            canSeeSortDropDown: canSeeSortDropDown,
            isAsc: sort.isAsc,
            selectSort: handleSelectSort,
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            toggleAsc: toggleAsc,
            toggleCanSeeSortDropDown: toggleCanSeeSortDropDown,
          }}
        />

        {user?.permissions.includes("create.role_resource") ? (
          <button
            onClick={handleCanCreateRole}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                                  gap-2 t:w-fit t:px-4 transition-all"
          >
            Create Role <IoAdd />
          </button>
        ) : null}

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedRoles}
        </div>
      </div>
    </div>
  ) : (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br 
                from-accent-green/50 via-accent-purple/30 to-accent-blue/50"
    >
      <p className="text-xl animate-fade font-bold">You have no access here.</p>
    </div>
  );
};

export default Role;
