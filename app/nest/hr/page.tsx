"use client";

import CreateHR from "@/src/components/management/CreateHR";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import { useAlert } from "@/src/context/AlertContext";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  ADMIN_HR_CATEGORY,
  ADMIN_HR_SEARCH,
  ADMIN_HR_SORT,
} from "@/src/configs/filters";
import { getCSRFToken } from "@/src/utils/token";
import { isCloudFileSummary } from "@/src/utils/utils";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import {
  IoAdd,
  IoBan,
  IoEllipsisVertical,
  IoMail,
  IoShieldCheckmark,
  IoShieldCheckmarkSharp,
} from "react-icons/io5";

const AdminHR = () => {
  const [hrs, setHrs] = React.useState<UserInterface[]>([]);
  const [canCreateHR, setCanCreateHR] = React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState(0);

  const { isLoading, handleIsLoading } = useIsLoading();

  const {
    canSeeSearchDropDown,
    search,
    handleSearch,
    handleCanSeeSearchDropDown,
    handleSelectSearch,
  } = useSearch("first_name", "First Name");

  const {
    canSeeSortDropDown,
    sort,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("first_name", "First Name");

  const {
    canSeeCategoryDropDown,
    category,
    toggleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("email_verified_at", "All");

  const { addToast } = useToasts();

  const { showAlert } = useAlert();

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const handleCanCreateHR = () => {
    setCanCreateHR((prev) => !prev);
  };

  const handleActiveMenu = (id: number) => {
    setActiveMenu((prev) => (prev === id ? 0 : id));
  };

  const sendMail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getAllHRs = React.useCallback(
    async (controller?: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token && user.permissions.includes("read.hr")) {
          const {
            data: { hrs },
          } = await axios.get(`${url}/hr`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
            signal: controller?.signal,
          });

          setHrs(hrs);
        }
      } catch (error) {
        console.log(error);

        if (isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the HRs are being retrieved.";
          addToast("HR List Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, user?.permissions, addToast, handleIsLoading]
  );

  const toggleVerification = async (hrId: number, toggle: boolean) => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token && user.permissions.includes("update.hr")) {
        const { data: responseData } = await axios.patch<{ success: boolean }>(
          `${url}/hr/${hrId}`,
          { toggle },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          const subject = `HR ${toggle ? "Verified" : "Deactivated"}`;
          const body = `Successfully ${toggle ? "verified" : "deactivated"} HR`;
          const toastType = "success";

          addToast(subject, body, toastType);

          await getAllHRs();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedHRs = useFilterAndSort(hrs, search, sort, category).map((hr) => {
    const isVerifed = hr.email_verified_at !== null;

    return (
      <div
        key={hr.id}
        className="w-full p-4 rounded-md bg-neutral-100 flex flex-row items-start justify-start gap-4 relative"
      >
        {/* hr image and name */}
        <div
          style={{
            backgroundImage: isCloudFileSummary(hr.image)
              ? `url(${hr.image.url})`
              : "",
          }}
          className="w-12 h-12 min-w-12 min-h-12 bg-linear-to-b from-accent-yellow to-accent-blue rounded-full bg-cover bg-center"
        />

        <div className="flex flex-col items-start justify-center gap-1 w-full overflow-hidden">
          <p
            title={`${hr.first_name} ${hr.last_name} `}
            className="font-bold truncate w-full"
          >
            {hr.first_name} {hr.last_name}
          </p>

          <p className="text-xs flex flex-row items-center justify-center gap-1">
            {isVerifed ? (
              <IoShieldCheckmark
                className="text-accent-blue"
                title={`Verified at: ${isVerifed}`}
              />
            ) : null}
            {hr.email}
          </p>
        </div>

        {/* menu button */}
        <button
          onClick={() => handleActiveMenu(hr.id)}
          className="p-2 text-xs hover:bg-neutral-200 rounded-full transition-all"
        >
          <IoEllipsisVertical
            className={`${
              activeMenu === hr.id ? "text-accent-blue" : "text-neutral-900"
            }`}
          />
        </button>

        {/* flyout */}
        {activeMenu === hr.id ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={() => sendMail(hr.email)}
              className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoMail className="text-accent-blue" />
              Mail
            </button>

            {user?.permissions.includes("update.hr") ? (
              <button
                onClick={() =>
                  showAlert({
                    title: `${isVerifed ? "Deactivate" : "Verify"} HR?`,
                    body: `Are you sure you want to ${
                      isVerifed ? "deactivate" : "verify"
                    } ${hr.first_name} ${hr.last_name}?`,
                    confirmAlert: () =>
                      toggleVerification(hr.id, !hr.email_verified_at),
                  })
                }
                className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
              >
                {isVerifed ? (
                  <>
                    <IoBan className="text-red-600" /> Deactivate
                  </>
                ) : (
                  <>
                    <IoShieldCheckmarkSharp className="text-green-600" /> Verify
                  </>
                )}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  });

  React.useEffect(() => {
    const controller = new AbortController();

    getAllHRs(controller);

    return () => {
      controller.abort();
    };
  }, [getAllHRs]);

  return user?.permissions.includes("read.hr") ? (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateHR && user?.permissions.includes("create.hr") ? (
        <CreateHR toggleModal={handleCanCreateHR} refetchIndex={getAllHRs} />
      ) : null}

      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
                  t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          //
          searchKeyLabelPairs={ADMIN_HR_SEARCH}
          search={{
            searchKey: search.searchKey,
            searchLabel: search.searchLabel,
            searchValue: search.searchValue,
            canSeeSearchDropDown: canSeeSearchDropDown,
            selectSearch: handleSelectSearch,
            toggleCanSeeSearchDropDown: handleCanSeeSearchDropDown,
            onChange: handleSearch,
          }}
          //
          sortKeyLabelPairs={ADMIN_HR_SORT}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            isAsc: sort.isAsc,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleAsc: handleToggleAsc,
            selectSort: handleSelectSort,
            toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
          }}
          //
          categoryKeyValuePairs={ADMIN_HR_CATEGORY}
          category={{
            categoryKey: category.categoryKey,
            categoryValue: category.categoryValue,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            toggleCanSeeCategoryDropDown: toggleCanSeeCategoryDropDown,
            selectCategory: handleSelectCategory,
          }}
        />

        {user?.permissions.includes("create.hr") ? (
          <button
            onClick={handleCanCreateHR}
            className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 transition-all"
          >
            Create HR
            <IoAdd className="text-lg" />
          </button>
        ) : null}

        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
            {mappedHRs}
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

export default AdminHR;
