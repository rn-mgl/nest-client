"use client";

import CreateTraining from "@/src/components/hr/training/CreateTraining";
import EditTraining from "@/src/components/hr/training/EditTraining";
import ShowTraining from "@/src/components/hr/training/ShowTraining";
import { TrainingInterface } from "@/src/interface/TrainingInterface";
import axios from "axios";

import DeleteEntity from "@/src/components/global/entity/DeleteEntity";
import Filter from "@/src/components/global/filter/Filter";
import AssignTraining from "@/src/components/hr/training/AssignTraining";

import BaseActions from "@/src/components/global/base/BaseActions";
import BaseCard from "@/src/components/global/base/BaseCard";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import HRActions from "@/src/components/hr/global/HRActions";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { isUserSummary } from "@/src/utils/utils";
import { HR_TRAINING_SEARCH, HR_TRAINING_SORT } from "@/utils/filters";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd } from "react-icons/io5";
import useFilterAndSort from "@/src/hooks/useFilterAndSort";

const HRTraining = () => {
  const [trainings, setTrainings] = React.useState<TrainingInterface[]>([]);
  const [activeTrainingSeeMore, setActiveTrainingSeeMore] = React.useState(0);
  const [activeEditTraining, setActiveEditTraining] = React.useState(0);
  const [activeDeleteTraining, setActiveDeleteTraining] = React.useState(0);
  const [canCreateTraining, setCanCreateTraining] = React.useState(false);
  const [activeAssignTraining, setActiveAssignTraining] = React.useState(0);

  const {
    search,
    canSeeSearchDropDown,
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

  const { isLoading, handleIsLoading } = useIsLoading(true);

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleCanCreateTraining = () => {
    setCanCreateTraining((prev) => !prev);
  };

  const handleActiveTrainingSeeMore = (id: number) => {
    setActiveTrainingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const handleActiveEditTraining = (id: number) => {
    setActiveEditTraining((prev) => (prev === id ? 0 : id));
  };

  const handleActiveDeleteTraining = (id: number) => {
    setActiveDeleteTraining((prev) => (prev === id ? 0 : id));
  };

  const handleActiveAssignTraining = (id: number) => {
    setActiveAssignTraining((prev) => (prev === id ? 0 : id));
  };

  const getTrainings = React.useCallback(async () => {
    try {
      handleIsLoading(true);

      if (user?.token) {
        const { data } = await axios.get(`${url}/hr/training`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });

        if (data.trainings) {
          setTrainings(data.trainings);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleIsLoading(false);
    }
  }, [user?.token, url, handleIsLoading]);

  const mappedTrainings = useFilterAndSort(trainings, search, sort).map(
    (training) => {
      const trainingId = training.id ?? 0;
      const createdBy = isUserSummary(training.created_by)
        ? training.created_by.first_name
        : null;
      return (
        <BaseCard
          key={`${training.title}-${trainingId}`}
          title={training.title}
          description={training.description}
          createdBy={createdBy}
        >
          <BaseActions
            handleActiveSeeMore={() => handleActiveTrainingSeeMore(trainingId)}
          />
          <HRActions
            handleActiveAssign={() => handleActiveAssignTraining(trainingId)}
            handleActiveDelete={() => handleActiveDeleteTraining(trainingId)}
            handleActiveEdit={() => handleActiveEditTraining(trainingId)}
          />
        </BaseCard>
      );
    }
  );

  React.useEffect(() => {
    getTrainings();
  }, [getTrainings]);

  if (isLoading) {
    return <PageSkeletonLoader />;
  }

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
          toggleModal={() => handleActiveTrainingSeeMore(0)}
        />
      ) : null}

      {activeEditTraining ? (
        <EditTraining
          id={activeEditTraining}
          toggleModal={() => handleActiveEditTraining(activeEditTraining)}
          refetchIndex={getTrainings}
        />
      ) : null}

      {activeAssignTraining ? (
        <AssignTraining
          id={activeAssignTraining}
          toggleModal={() => handleActiveAssignTraining(activeAssignTraining)}
        />
      ) : null}

      {activeDeleteTraining ? (
        <DeleteEntity
          route="training"
          label="Training"
          id={activeDeleteTraining}
          toggleModal={() => handleActiveDeleteTraining(activeDeleteTraining)}
          refetchIndex={getTrainings}
        />
      ) : null}

      <div
        className="w-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2
          t:items-start t:p-4 gap-4 t:gap-8"
      >
        <Filter
          searchKeyLabelPairs={HR_TRAINING_SEARCH}
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
          sortKeyLabelPairs={HR_TRAINING_SORT}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            isAsc: sort.isAsc,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleAsc: handleToggleAsc,
            selectSort: handleSelectSort,
            toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
          }}
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
