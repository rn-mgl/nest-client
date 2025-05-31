"use client";
import CreateHR from "@/src/components/controller/hr/CreateHR";
import Filter from "@/src/components/global/filter/Filter";
import useCategory from "@/src/hooks/useCategory";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  ADMIN_HR_CATEGORY,
  ADMIN_HR_SEARCH,
  ADMIN_HR_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

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
  const [hrs, setHrs] = React.useState<Array<UserInterface>>();
  const [canCreateHR, setCanCreateHR] = React.useState(false);
  const [activeHRMenu, setActiveHRMenu] = React.useState(0);

  const {
    search,
    canSeeSearchDropDown,
    debounceSearch,
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
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("verified", "all", "Verified");

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const handleCanCreateHR = () => {
    setCanCreateHR((prev) => !prev);
  };

  const handleActiveHRMenu = (id: number) => {
    setActiveHRMenu((prev) => (prev === id ? 0 : id));
  };

  const sendMail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const getAllHRs = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const {
          data: { hrs },
        } = await axios.get(`${url}/admin/hr`, {
          headers: {
            "X-CSRF-TOKEN": token,
            Authorization: `Bearer ${user?.token}`,
          },
          params: {
            ...category,
            ...sort,
            ...search,
          },
          withCredentials: true,
        });

        setHrs(hrs);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, category, sort, search]);

  const verifyHR = async (id: number) => {
    try {
      const { token } = await getCSRFToken();

      if (token) {
        const { data: verified } = await axios.patch(
          `${url}/admin/hr/${id}`,
          { type: "verify" },
          {
            headers: {
              "X-CSRF-TOKEN": token,
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );

        if (verified.success) {
          getAllHRs();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deactivateHR = async (id: number) => {
    try {
      const { token } = await getCSRFToken();

      if (token) {
        const { data: deactivated } = await axios.patch(
          `${url}/admin/hr/${id}`,
          { type: "deactivate" },
          {
            headers: {
              "X-CSRF-TOKEN": token,
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );

        if (deactivated.success) {
          getAllHRs();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedHRs = hrs?.map((hr) => {
    return (
      <div
        key={hr.user_id}
        className="w-full p-4 rounded-md bg-neutral-100 flex flex-row items-start justify-start gap-4 relative"
      >
        <div className="w-12 h-12 min-w-12 min-h-12 bg-linear-to-b from-accent-yellow to-accent-blue rounded-full"></div>
        <div className="flex flex-col items-start justify-center gap-1 w-full overflow-hidden">
          <p
            title={`${hr.first_name} ${hr.last_name} `}
            className="font-bold truncate w-full"
          >
            {hr.first_name} {hr.last_name}
          </p>
          <p className="text-xs flex flex-row items-center justify-center gap-1">
            {hr.email_verified_at ? (
              <IoShieldCheckmark
                className="text-accent-blue"
                title={`Verified at: ${hr.email_verified_at}`}
              />
            ) : null}
            {hr.email}
          </p>
        </div>
        <button
          onClick={() => handleActiveHRMenu(hr.user_id)}
          className="p-2 text-xs hover:bg-neutral-200 rounded-full transition-all"
        >
          <IoEllipsisVertical
            className={`${
              activeHRMenu === hr.user_id
                ? "text-accent-blue"
                : "text-neutral-900"
            }`}
          />
        </button>

        {activeHRMenu === hr.user_id ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={() => sendMail(hr.email)}
              className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoMail className="text-accent-blue" />
              Mail
            </button>
            {hr.email_verified_at ? (
              <button
                onClick={() => deactivateHR(hr.user_id)}
                className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
              >
                <IoBan className="text-red-600" />
                Deactivate
              </button>
            ) : (
              <button
                onClick={() => verifyHR(hr.user_id)}
                className="w-full p-1 rounded-xs text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
              >
                <IoShieldCheckmarkSharp className="text-green-600" />
                Verify
              </button>
            )}
          </div>
        ) : null}
      </div>
    );
  });

  React.useEffect(() => {
    getAllHRs();
  }, [getAllHRs]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateHR ? (
        <CreateHR toggleModal={handleCanCreateHR} refetchIndex={getAllHRs} />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
                  t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          useSearchFilter={true}
          useSortFilter={true}
          useCategoryFilter={true}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={ADMIN_HR_SEARCH}
          canSeeSearchDropDown={canSeeSearchDropDown}
          selectSearch={handleSelectSearch}
          toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
          onChange={handleSearch}
          categoryLabel={category.categoryLabel}
          canSeeCategoryDropDown={canSeeCategoryDropDown}
          categoryKeyValuePairs={ADMIN_HR_CATEGORY}
          toggleCanSeeCategoryDropDown={handleCanSeeCategoryDropDown}
          selectCategory={handleSelectCategory}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canSeeSortDropDown={canSeeSortDropDown}
          sortKeyLabelPairs={ADMIN_HR_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
        />

        <button
          onClick={handleCanCreateHR}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-40 transition-all"
        >
          Create HR
          <IoAdd className="text-lg" />
        </button>

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedHRs}
        </div>
      </div>
    </div>
  );
};

export default AdminHR;
