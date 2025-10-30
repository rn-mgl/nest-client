"use client";

import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import UserCard from "@/src/components/management/UserCard";
import {
  MANAGEMENT_CATEGORY,
  MANAGEMENT_SEARCH,
  MANAGEMENT_SORT,
} from "@/src/configs/filters";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { RoleInterface } from "@/src/interface/RoleInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { normalizeString } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const User = () => {
  const [users, setUsers] = React.useState<
    (UserInterface & { roles: RoleInterface[] })[]
  >([]);

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const { isLoading, handleIsLoading } = useIsLoading();

  const { addToast } = useToasts();

  const {
    search,
    canSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
    toggleCanSeeSearchDropDown,
  } = useSearch("first_name", "Name");
  const {
    canSeeSortDropDown,
    handleSelectSort,
    sort,
    toggleAsc,
    toggleCanSeeSortDropDown,
  } = useSort("first_name", "Name");
  const {
    canSeeCategoryDropDown,
    category,
    handleSelectCategory,
    toggleCanSeeCategoryDropDown,
  } = useCategory("verification_status", "All");

  const handleSendMail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getUsers = React.useCallback(
    async (controller: AbortController) => {
      try {
        handleIsLoading(true);

        if (user?.token && user.permissions.includes("read.users")) {
          const { data: responseData } = await axios.get(`${url}/users`, {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
            signal: controller.signal,
          });

          if (responseData.users) {
            setUsers(responseData.users);
          }
        }
      } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the users are being retrieved";

          addToast("Users Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, handleIsLoading, addToast, user?.permissions]
  );

  const mappedUsers = useFilterAndSort(users, search, sort, category).map(
    (user) => {
      const mappedRoles = user.roles.map((role) => {
        return (
          <div
            key={role.role}
            className="text-xs p-1 rounded-l-full rounded-r-full bg-neutral-300 px-2"
          >
            {normalizeString(role.role)}
          </div>
        );
      });

      return (
        <UserCard
          sendMail={() => handleSendMail(user.email)}
          key={`user-${user.id}`}
          user={user}
        >
          <div className="w-full flex flex-row items-center justify-start gap-2 flex-wrap max-h-40 overflow-y-auto bg-neutral-200 p-2 rounded-md">
            {mappedRoles}
          </div>
        </UserCard>
      );
    }
  );

  React.useEffect(() => {
    const controller = new AbortController();

    getUsers(controller);

    return () => {
      controller.abort();
    };
  }, [getUsers]);

  return user?.permissions.includes("read.users") ? (
    <div
      className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
                  t:items-start t:p-4 gap-4 t:gap-8"
    >
      <div className="w-full flex flex-col items-center justify-start gap-4">
        <Filter
          searchKeyLabelPairs={MANAGEMENT_SEARCH}
          search={{
            canSeeSearchDropDown: canSeeSearchDropDown,
            onChange: handleSearch,
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            selectSearch: handleSelectSearch,
            toggleCanSeeSearchDropDown: toggleCanSeeSearchDropDown,
          }}
          sortKeyLabelPairs={MANAGEMENT_SORT}
          sort={{
            canSeeSortDropDown: canSeeSortDropDown,
            isAsc: sort.isAsc,
            selectSort: handleSelectSort,
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            toggleAsc: toggleAsc,
            toggleCanSeeSortDropDown: toggleCanSeeSortDropDown,
          }}
          categoryKeyValuePairs={MANAGEMENT_CATEGORY}
          category={{
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            categoryKey: category.categoryKey,
            categoryValue: category.categoryValue,
            selectCategory: handleSelectCategory,
            toggleCanSeeCategoryDropDown: toggleCanSeeCategoryDropDown,
          }}
        />
        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
            {mappedUsers}
          </div>
        )}
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

export default User;
