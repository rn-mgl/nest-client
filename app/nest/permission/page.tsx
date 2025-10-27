"use client";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import CreatePermission from "@/src/components/global/permission/CreatePermission";
import EditPermission from "@/src/components/global/permission/EditPermission";
import BaseCard from "@/src/components/global/resource/BaseCard";
import ResourceActions from "@/src/components/global/resource/ResourceActions";
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

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const handleActiveEditPermission = (id: number) => {
    setActiveEditPermission((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDeletePermission = (id: number) => {
    setActiveDeletePermission((prev) => (prev === id ? 0 : id));
  };

  const handleCanCreatePermission = () => {
    setCanCreatePermission((prev) => !prev);
  };

  const getPermissions = React.useCallback(
    async (controller?: AbortController) => {
      try {
        if (user?.token) {
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
    [url, user?.token]
  );

  const mappedPermissions = permissions.map((permission) => {
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
        <ResourceActions
          handleActiveEdit={() =>
            handleActiveEditPermission(permission.id ?? 0)
          }
          handleActiveDelete={() =>
            handleActiveDeletePermission(permission.id ?? 0)
          }
        />
      </BaseCard>
    );
  });

  React.useEffect(() => {
    const controller = new AbortController();

    getPermissions(controller);

    return () => {
      controller.abort();
    };
  }, [getPermissions]);

  return (
    <div className="w-full  flex flex-col items-center justify-start">
      {canCreatePermission ? (
        <CreatePermission
          toggleModal={() => handleCanCreatePermission()}
          refetchIndex={getPermissions}
        />
      ) : null}

      {activeEditPermission ? (
        <EditPermission
          toggleModal={() => handleActiveEditPermission(activeEditPermission)}
          id={activeEditPermission}
          refetchIndex={getPermissions}
        />
      ) : null}

      {activeDeletePermission ? (
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
        <button
          onClick={handleCanCreatePermission}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                                  gap-2 t:w-fit t:px-4 transition-all"
        >
          Create Permission <IoAdd />
        </button>
        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
          {mappedPermissions}
        </div>
      </div>
    </div>
  );
};

export default Permission;
