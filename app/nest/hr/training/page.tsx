"use client";

import CreateTraining from "@/src/components/hr/training/CreateTraining";
import EditTraining from "@/src/components/hr/training/EditTraining";
import ShowTraining from "@/src/components/hr/training/ShowTraining";
import { TrainingInterface } from "@/src/interface/TrainingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import Filter from "@/src/components/global/filter/Filter";
import DeleteEntity from "@/src/components/hr/global/DeleteEntity";
import AssignTraining from "@/src/components/hr/training/AssignTraining";
import TrainingCard from "@/src/components/hr/training/TrainingCard";

import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { HR_TRAINING_SEARCH, HR_TRAINING_SORT } from "@/utils/filters";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";

const HRTraining = () => {
  const [trainings, setTrainings] = React.useState<
    Array<TrainingInterface & UserInterface>
  >([]);
  const [activeTrainingMenu, setActiveTrainingMenu] = React.useState(0);
  const [activeTrainingSeeMore, setActiveTrainingSeeMore] = React.useState(0);
  const [canEditTraining, setCanEditTraining] = React.useState(false);
  const [canDeleteTraining, setCanDeleteTraining] = React.useState(false);
  const [canCreateTraining, setCanCreateTraining] = React.useState(false);
  const [canAssignTraining, setCanAssignTraining] = React.useState(false);

  const {
    search,
    canSeeSearchDropDown,
    debounceSearch,
    handleSearch,
    handleCanSeeSearchDropDown,
    handleSelectSearch,
  } = useSearch("title", "Title");
  const {
    canSeeSortDropDown,
    sort,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("created_at", "Created At");

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

  const handleCanAssignTraining = () => {
    setCanAssignTraining((prev) => !prev);
  };

  const getTrainings = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data } = await axios.get(`${url}/hr/training`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
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
    const trainingId = training.training_id as number;
    const createdBy = training.user_id === user?.current;
    const activeMenu = activeTrainingMenu === trainingId;
    return (
      <TrainingCard
        role={user?.role as string}
        key={index}
        activeMenu={activeMenu}
        createdBy={createdBy}
        training={training}
        handleActiveMenu={() => handleActiveTrainingMenu(trainingId)}
        handleActiveSeeMore={() => handleActiveTrainingSeeMore(trainingId)}
        handleCanDelete={handleCanDeleteTraining}
        handleCanEdit={handleCanEditTraining}
        handleCanAssign={handleCanAssignTraining}
      />
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

      {canAssignTraining ? (
        <AssignTraining
          id={activeTrainingMenu}
          toggleModal={handleCanAssignTraining}
        />
      ) : null}

      {canDeleteTraining ? (
        <DeleteEntity
          route="training"
          label="Training"
          id={activeTrainingMenu}
          toggleModal={handleCanDeleteTraining}
          refetchIndex={getTrainings}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          useSearchFilter={true}
          useSortFilter={true}
          useCategoryFilter={false}
          searchKey={debounceSearch.searchKey}
          searchLabel={debounceSearch.searchLabel}
          searchValue={debounceSearch.searchValue}
          searchKeyLabelPairs={HR_TRAINING_SEARCH}
          canSeeSearchDropDown={canSeeSearchDropDown}
          selectSearch={handleSelectSearch}
          toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
          onChange={handleSearch}
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canSeeSortDropDown={canSeeSortDropDown}
          sortKeyLabelPairs={HR_TRAINING_SORT}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
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
