"use client";

import CreateTraining from "@/src/components/hr/training/CreateTraining";
import DeleteTraining from "@/src/components/hr/training/DeleteTraining";
import EditTraining from "@/src/components/hr/training/EditTraining";
import ShowTraining from "@/src/components/hr/training/ShowTraining";
import { TrainingInterface } from "@/src/interface/TrainingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import {
  HR_TRAINING_CATEGORY,
  HR_TRAINING_SEARCH,
  HR_TRAINING_SORT,
} from "@/utils/filters";
import {
  IoAdd,
  IoArrowForward,
  IoEllipsisVertical,
  IoPencil,
  IoTrash,
} from "react-icons/io5";
import useFilters from "@/src/hooks/useFilters";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import useCategory from "@/src/hooks/useCategory";
import Filter from "@/src/components/global/Filter";

const HRTraining = () => {
  const [trainings, setTrainings] = React.useState<
    Array<TrainingInterface & UserInterface>
  >([]);
  const [activeTrainingMenu, setActiveTrainingMenu] = React.useState(0);
  const [activeTrainingSeeMore, setActiveTrainingSeeMore] = React.useState(0);
  const [canEditTraining, setCanEditTraining] = React.useState(false);
  const [canDeleteTraining, setCanDeleteTraining] = React.useState(false);
  const [canCreateTraining, setCanCreateTraining] = React.useState(false);

  const { showFilters, handleShowFilters } = useFilters();
  const {
    search,
    canShowSearch,
    debounceSearch,
    handleSearch,
    handleCanShowSearch,
    handleSelectSearch,
  } = useSearch("title", "Title");
  const {
    canShowSort,
    sort,
    handleCanShowSort,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("created_at", "Created At");
  const {
    canShowCategories,
    category,
    handleCanShowCategories,
    handleSelectCategory,
  } = useCategory("", "", "");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleCanCreateTraining = () => {
    setCanCreateTraining((prev) => !prev);
  };

  const handleActiveTrainingMenu = (id: number) => {
    setActiveTrainingMenu((prev) => (prev === id ? 0 : id));
  };

  const handleActiveTrainingSeeMore = (id: number) => {
    setActiveTrainingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleCanEditTraining = () => {
    setCanEditTraining((prev) => !prev);
  };

  const handleCanDeleteTraining = () => {
    setCanDeleteTraining((prev) => !prev);
  };

  const getTrainings = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data } = await axios.get(`${url}/hr/training`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
          params: { ...search, ...sort },
          withCredentials: true,
        });

        if (data.trainings) {
          setTrainings(data.trainings);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, url, search, sort]);

  const mappedTrainings = trainings.map((training, index) => {
    const createdBy = training.user_id === user?.current;
    const activeMenu = training.training_id === activeTrainingMenu;
    return (
      <div
        key={index}
        className="w-full min-h-[17rem] p-4 rounded-md bg-neutral-100 flex 
                      flex-col items-center justify-start gap-4 relative max-w-full transition-all"
      >
        <div className="flex flex-row items-start justify-between w-full">
          <div className="flex flex-col items-start justify-start">
            <p className="font-bold truncate">{training.title}</p>
          </div>

          <button
            onClick={() =>
              training.training_id &&
              handleActiveTrainingMenu(training.training_id)
            }
            className="p-2 rounded-full bg-neutral-100 transition-all"
          >
            <IoEllipsisVertical
              className={`${
                activeMenu ? "text-accent-blue" : "text-neutral-900"
              }`}
            />
          </button>
        </div>

        <div className="w-full h-40 max-h-40 min-h-40 flex flex-col items-center justify-start overflow-y-auto bg-neutral-200 p-2 rounded-sm">
          <p className="text-sm w-full text-wrap break-words">
            {training.description}
          </p>
        </div>

        <button
          onClick={() =>
            training.training_id &&
            handleActiveTrainingSeeMore(training.training_id)
          }
          className="text-xs hover:underline transition-all underline-offset-2 flex flex-row items-center justify-start gap-1"
        >
          See More <IoArrowForward />
        </button>

        {activeMenu ? (
          <div className="w-32 p-2 rounded-md top-12 right-6 shadow-md bg-neutral-200 absolute animate-fade z-20">
            <button
              onClick={handleCanEditTraining}
              className="w-full p-1 rounded-sm text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
            >
              <IoPencil className="text-accent-blue" />
              Edit
            </button>

            {createdBy ? (
              <button
                onClick={handleCanDeleteTraining}
                className="w-full p-1 rounded-sm text-sm bg-neutral-200 transition-all flex flex-row gap-2 items-center justify-start"
              >
                <IoTrash className="text-red-600" />
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  });

  React.useEffect(() => {
    getTrainings();
  }, [getTrainings]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {canCreateTraining ? (
        <CreateTraining
          toggleModal={handleCanCreateTraining}
          refetchIndex={getTrainings}
        />
      ) : null}

      {activeTrainingSeeMore ? (
        <ShowTraining
          id={activeTrainingSeeMore}
          setActiveModal={handleActiveTrainingSeeMore}
        />
      ) : null}

      {canEditTraining ? (
        <EditTraining
          id={activeTrainingMenu}
          toggleModal={handleCanEditTraining}
          refetchIndex={getTrainings}
        />
      ) : null}

      {canDeleteTraining ? (
        <DeleteTraining
          id={activeTrainingMenu}
          refetchIndex={getTrainings}
          toggleModal={handleCanDeleteTraining}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-screen-l-l p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          showSearch={true}
          showSort={true}
          showCategory={false}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={HR_TRAINING_SEARCH}
          canShowSearch={canShowSearch}
          selectSearch={handleSelectSearch}
          toggleShowSearch={handleCanShowSearch}
          onChange={handleSearch}
          showFilters={showFilters}
          toggleShowFilters={handleShowFilters}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canShowSort={canShowSort}
          sortKeyLabelPairs={HR_TRAINING_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleShowSort={handleCanShowSort}
          //
          categoryLabel={category.categoryLabel}
          canShowCategories={canShowCategories}
          categoryKeyValuePairs={HR_TRAINING_CATEGORY}
          toggleShowCategories={handleCanShowCategories}
          selectCategory={handleSelectCategory}
        />

        <button
          onClick={handleCanCreateTraining}
          className="bg-accent-blue text-accent-yellow w-full p-2 rounded-md font-bold flex flex-row items-center justify-center 
                  gap-2 t:w-fit t:px-4 transition-all"
        >
          Create Training <IoAdd className="text-lg" />
        </button>

        <div className="w-full grid grid-cols-1 gap-4 t:grid-cols-2 l-l:grid-cols-3">
          {mappedTrainings}
        </div>
      </div>
    </div>
  );
};

export default HRTraining;
