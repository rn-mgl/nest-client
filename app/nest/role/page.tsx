"use client";

import BaseActions from "@/src/components/global/resource/BaseActions";
import BaseCard from "@/src/components/global/resource/BaseCard";
import { RoleInterface } from "@/src/interface/RoleInterface";
import { isUserSummary, normalizeString } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Role = () => {
  const [roles, setRoles] = React.useState<RoleInterface[]>([]);
  const [activeRoleSeeMore, setActiveRoleSeeMore] = React.useState(0);

  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const url = process.env.URL;

  const getRoles = React.useCallback(
    async (controller: AbortController) => {
      try {
        if (user?.token) {
          const { data: responseData } = await axios.get(`${url}/role`, {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
            signal: controller.signal,
          });

          if (responseData.roles) {
            setRoles(responseData.roles);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [url, user?.token]
  );

  const handleActiveRoleSeeMore = (id: number) => {
    setActiveRoleSeeMore((prev) => (prev === id ? 0 : id));
  };

  const mappedRoles = roles.map((role) => {
    const createdBy = isUserSummary(role.created_by)
      ? role.created_by.first_name
      : null;

    return (
      <BaseCard
        key={`role-${role.role}-${role.id}`}
        title={normalizeString(role.role)}
        description="asd"
        createdBy={createdBy}
      >
        <BaseActions
          handleActiveSeeMore={() => handleActiveRoleSeeMore(role.id ?? 0)}
        />
      </BaseCard>
    );
  });

  React.useEffect(() => {
    const controller = new AbortController();

    getRoles(controller);

    return () => {
      controller.abort();
    };
  }, [getRoles]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 t:p-4">
        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedRoles}
        </div>
      </div>
    </div>
  );
};

export default Role;
