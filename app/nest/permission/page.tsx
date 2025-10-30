"use client";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import AssignPermission from "@/src/components/global/permission/AssignPermission";
import CreatePermission from "@/src/components/global/permission/CreatePermission";
import EditPermission from "@/src/components/global/permission/EditPermission";
import BaseCard from "@/src/components/global/resource/BaseCard";
import ResourceActions from "@/src/components/global/resource/ResourceActions";
import {
  RESOURCE_PERMISSION_SEARCH,
  RESOURCE_PERMISSION_SORT,
} from "@/src/configs/filters";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { PermissionInterface } from "@/src/interface/PermissionInterface";
import { isUserSummary } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const Permission = () => {
  const [permissions, setPermissions] = React.useState<PermissionInterface[]>(
    []
  );
  const [canCreatePermission, setCanCreatePermission] = React.useState(false);
  const [activeEditPermission, setActiveEditPermission] = React.useState(0);
  const [activeDeletePermission, setActiveDeletePermission] = React.useState(0);
  const [activeAssignPermission, setActiveAssignPermission] = React.useState(0);

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const {
    canSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
    search,
    toggleCanSeeSearchDropDown,
  } = useSearch("name", "Name");

  const {
    canSeeSortDropDown,
    handleSelectSort,
    sort,
    toggleAsc,
    toggleCanSeeSortDropDown,
  } = useSort("name", "Name");

  const canEdit = React.useMemo(() => {
    return user?.permissions.includes("update.permission_resource");
  }, [user?.permissions]);

  const canDelete = React.useMemo(() => {
    return user?.permissions.includes("delete.permission_resource");
  }, [user?.permissions]);

  const canAssign = React.useMemo(() => {
    return user?.permissions.includes("assign.permission_resource");
  }, [user?.permissions]);

  const canManage = React.useMemo(() => {
    return canEdit || canDelete || canAssign;
  }, [canEdit, canDelete, canAssign]);

  const handleActiveEditPermission = (id: number) => {
    setActiveEditPermission((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDeletePermission = (id: number) => {
    setActiveDeletePermission((prev) => (prev === id ? 0 : id));
  };

  const handleCanCreatePermission = () => {
    setCanCreatePermission((prev) => !prev);
  };

  const handleActiveAssignPermission = (id: number) => {
    setActiveAssignPermission((prev) => (prev === id ? 0 : id));
  };

  const getPermissions = React.useCallback(
    async (controller?: AbortController) => {
      try {
        if (
          user?.token &&
          user?.permissions.includes("read.permission_resource")
        ) {
          const { data: responseData } = await axios.get(
            `${url}/permission/resource`,
            {
              headers: { Authorization: `Bearer ${user.token}` },
              withCredentials: true,
              signal: controller?.signal,
            }
          );

          if (responseData.permissions) {
            setPermissions(responseData.permissions);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [url, user?.token, user?.permissions]
  );

  const mappedPermissions = useFilterAndSort(permissions, search, sort).map(
    (permission) => {
      const createdBy = isUserSummary(permission.created_by)
        ? permission.created_by.first_name
        : null;

      return (
        <BaseCard
          key={`permission-${permission.name}`}
          title={permission.name}
          description={permission.description}
          createdBy={createdBy}
        >
          {canManage ? (
            <ResourceActions
              handleActiveEdit={
                canEdit
                  ? () => handleActiveEditPermission(permission.id ?? 0)
                  : null
              }
              handleActiveDelete={
                canDelete
                  ? () => handleActiveDeletePermission(permission.id ?? 0)
                  : null
              }
              handleActiveAssign={
                canAssign
                  ? () => handleActiveAssignPermission(permission.id ?? 0)
                  : null
              }
            />
          ) : null}
        </BaseCard>
      );
    }
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getPermissions(controller);

    return () => {
      controller.abort();
    };
  }, [getPermissions]);

  return (
    <div className="w-full  flex flex-col items-center justify-start">
      {canCreatePermission &&
      user?.permissions.includes("create.permission_resource") ? (
        <CreatePermission
          toggleModal={() => handleCanCreatePermission()}
          refetchIndex={getPermissions}
        />
      ) : null}

      {activeEditPermission &&
      user?.permissions.includes("update.permission_resource") ? (
        <EditPermission
          toggleModal={() => handleActiveEditPermission(activeEditPermission)}
          id={activeEditPermission}
          refetchIndex={getPermissions}
        />
      ) : null}

      {activeAssignPermission &&
      user?.permissions.includes("assign.permission_resource") ? (
        <AssignPermission
          toggleModal={() =>
            handleActiveAssignPermission(activeAssignPermission)
          }
          id={activeAssignPermission}
        />
      ) : null}

      {activeDeletePermission &&
      user?.permissions.includes("delete.permission_resource") ? (
        <DeleteEntity
          route="permission/resource"
          toggleModal={() =>
            handleActiveDeletePermission(activeDeletePermission)
          }
          id={activeDeletePermission}
          label="Permission"
          refetchIndex={getPermissions}
        />
      ) : null}

      <div className="w-full flex flex-col items-start justify-start gap-4 p-2 t:p-4 max-w-(--breakpoint-l-l)">
        <Filter
          searchKeyLabelPairs={RESOURCE_PERMISSION_SEARCH}
          search={{
            canSeeSearchDropDown: canSeeSearchDropDown,
            onChange: handleSearch,
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            selectSearch: handleSelectSearch,
            toggleCanSeeSearchDropDown: toggleCanSeeSearchDropDown,
          }}
          sortKeyLabelPairs={RESOURCE_PERMISSION_SORT}
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

        {user?.permissions.includes("create.permission_resource") ? (
          <button
            onClick={handleCanCreatePermission}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                                  gap-2 t:w-fit t:px-4 transition-all"
          >
            Create Permission <IoAdd />
          </button>
        ) : null}

        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
          {mappedPermissions}
        </div>
      </div>
    </div>
  );
};

export default Permission;
