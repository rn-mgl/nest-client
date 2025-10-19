"use client";
import ShowTraining from "@/src/components/employee/training/ShowTraining";
import BaseActions from "@/src/components/global/resource/BaseActions";
import BaseCard from "@/src/components/global/resource/BaseCard";
import Filter from "@/src/components/global/filter/Filter";
import PageSkeletonLoader from "@/src/components/global/loader/PageSkeletonLoader";
import { useToasts } from "@/src/context/ToastContext";
import useCategory from "@/src/hooks/useCategory";
import useIsLoading from "@/src/hooks/useIsLoading";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import { UserTrainingInterface } from "@/src/interface/TrainingInterface";
import {
  EMPLOYEE_TRAINING_CATEGORY,
  EMPLOYEE_TRAINING_SEARCH,
  EMPLOYEE_TRAINING_SORT,
} from "@/src/utils/filters";
import { isUserSummary } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Training = () => {
  const [trainings, setTrainings] = React.useState<UserTrainingInterface[]>([]);
  const [activeTrainingSeeMore, setActiveTrainingSeeMore] = React.useState(0);
  const { isLoading, handleIsLoading } = useIsLoading();
  const { addToast } = useToasts();

  const {
    canSeeSearchDropDown,
    search,
    handleCanSeeSearchDropDown,
    handleSearch,
    handleSelectSearch,
  } = useSearch("title", "Title");
  const {
    sort,
    canSeeSortDropDown,
    handleCanSeeSortDropDown,
    handleSelectSort,
    handleToggleAsc,
  } = useSort("deadline", "Deadline");
  const {
    category,
    canSeeCategoryDropDown,
    toggleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("status", "All");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const handleActiveTrainingSeeMore = (id: number) => {
    setActiveTrainingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const getTrainings = React.useCallback(
    async (controller: AbortController) => {
      handleIsLoading(true);
      try {
        if (user?.token) {
          const { data: responseData } = await axios.get<{
            trainings: UserTrainingInterface[];
          }>(`${url}/employee/employee_training`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
            signal: controller.signal,
          });

          if (responseData.trainings) {
            setTrainings(responseData.trainings);
          }
        }
      } catch (error) {
        console.log(error);

        if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
          const message =
            error.response?.data.message ??
            error.message ??
            "An error occurred when the trainings are being retrieved.";
          addToast("Training Error", message, "error");
        }
      } finally {
        handleIsLoading(false);
      }
    },
    [url, user?.token, addToast, handleIsLoading]
  );

  const mappedTrainings = trainings.map((training, index) => {
    const assignedBy = isUserSummary(training.assigned_by)
      ? training.assigned_by.first_name
      : null;

    return (
      <BaseCard
        key={index}
        title={training.training.title}
        description={training.training.description}
        assignedBy={assignedBy}
      >
        <BaseActions
          handleActiveSeeMore={() =>
            handleActiveTrainingSeeMore(training.id ?? 0)
          }
        />
      </BaseCard>
    );
  });

  React.useEffect(() => {
    const controller = new AbortController();

    getTrainings(controller);

    return () => {
      controller.abort();
    };
  }, [getTrainings]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      {activeTrainingSeeMore ? (
        <ShowTraining
          id={activeTrainingSeeMore}
          toggleModal={() => handleActiveTrainingSeeMore(0)}
        />
      ) : null}
      <div
        className="w-full h-full flex flex-col items-center justify-start max-w-(--breakpoint-l-l) p-2 
                    t:items-start gap-4 t:p-4 t:gap-8"
      >
        <Filter
          searchKeyLabelPairs={EMPLOYEE_TRAINING_SEARCH}
          search={{
            searchKey: search.searchKey,
            searchValue: search.searchValue,
            searchLabel: search.searchLabel,
            canSeeSearchDropDown: canSeeSearchDropDown,
            toggleCanSeeSearchDropDown: handleCanSeeSearchDropDown,
            onChange: handleSearch,
            selectSearch: handleSelectSearch,
          }}
          //
          categoryKeyValuePairs={EMPLOYEE_TRAINING_CATEGORY}
          category={{
            categoryKey: category.categoryKey,
            categoryValue: category.categoryValue,
            canSeeCategoryDropDown: canSeeCategoryDropDown,
            toggleCanSeeCategoryDropDown: toggleCanSeeCategoryDropDown,
            selectCategory: handleSelectCategory,
          }}
          //
          sortKeyLabelPairs={EMPLOYEE_TRAINING_SORT}
          sort={{
            sortKey: sort.sortKey,
            sortLabel: sort.sortLabel,
            isAsc: sort.isAsc,
            canSeeSortDropDown: canSeeSortDropDown,
            toggleCanSeeSortDropDown: handleCanSeeSortDropDown,
            toggleAsc: handleToggleAsc,
            selectSort: handleSelectSort,
          }}
        />

        {isLoading ? (
          <PageSkeletonLoader />
        ) : (
          <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
            {mappedTrainings}
          </div>
        )}
      </div>
    </div>
  );
};

export default Training;
