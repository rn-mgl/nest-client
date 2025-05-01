"use client";
import ShowTraining from "@/src/components/employee/training/ShowTraining";
import Filter from "@/src/components/global/filter/Filter";
import TrainingCard from "@/src/components/global/training/TrainingCard";
import useCategory from "@/src/hooks/useCategory";
import useSearch from "@/src/hooks/useSearch";
import useSort from "@/src/hooks/useSort";
import {
  EmployeeTrainingInterface,
  TrainingInterface,
} from "@/src/interface/TrainingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import {
  EMPLOYEE_TRAINING_CATEGORY,
  EMPLOYEE_TRAINING_SEARCH,
  EMPLOYEE_TRAINING_SORT,
} from "@/src/utils/filters";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Training = () => {
  const [trainings, setTrainings] = React.useState<
    (TrainingInterface & EmployeeTrainingInterface & UserInterface)[]
  >([]);
  const [activeTrainingSeeMore, setActiveTrainingSeeMore] = React.useState(0);

  const {
    canSeeSearchDropDown,
    debounceSearch,
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
    handleCanSeeCategoryDropDown,
    handleSelectCategory,
  } = useCategory("status", "all", "All");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const handleActiveTrainingSeeMore = (id: number) => {
    setActiveTrainingSeeMore((prev) => (prev === id ? 0 : id));
  };

  const getTrainings = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_training`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
            params: { ...search, ...sort, ...category },
          }
        );

        if (responseData.trainings) {
          setTrainings(responseData.trainings);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, search, sort, category]);

  const mappedTrainings = trainings.map((training, index) => {
    return (
      <TrainingCard
        role={user?.role ?? ""}
        key={index}
        createdBy={false}
        //
        title={training.title}
        description={training.description}
        deadline_days={training.deadline_days}
        certificate={training.certificate}
        status={training.status}
        deadline={training.deadline}
        //
        user_id={training.user_id}
        email={training.email}
        email_verified_at={training.email_verified_at}
        first_name={training.first_name}
        last_name={training.last_name}
        //
        handleActiveSeeMore={() =>
          handleActiveTrainingSeeMore(training.employee_training_id ?? 0)
        }
      />
    );
  });

  React.useEffect(() => {
    getTrainings();
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
          useCategoryFilter={true}
          useSortFilter={true}
          useSearchFilter={true}
          //
          searchKey={debounceSearch.searchKey}
          searchValue={debounceSearch.searchValue}
          searchLabel={debounceSearch.searchLabel}
          canSeeSearchDropDown={canSeeSearchDropDown}
          toggleCanSeeSearchDropDown={handleCanSeeSearchDropDown}
          onChange={handleSearch}
          selectSearch={handleSelectSearch}
          searchKeyLabelPairs={EMPLOYEE_TRAINING_SEARCH}
          //
          categoryLabel={category.categoryLabel}
          canSeeCategoryDropDown={canSeeCategoryDropDown}
          toggleCanSeeCategoryDropDown={handleCanSeeCategoryDropDown}
          selectCategory={handleSelectCategory}
          sortKeyLabelPairs={EMPLOYEE_TRAINING_SORT}
          //
          sortKey={sort.sortKey}
          sortLabel={sort.sortLabel}
          isAsc={sort.isAsc}
          canSeeSortDropDown={canSeeSortDropDown}
          toggleCanSeeSortDropDown={handleCanSeeSortDropDown}
          toggleAsc={handleToggleAsc}
          selectSort={handleSelectSort}
          categoryKeyValuePairs={EMPLOYEE_TRAINING_CATEGORY}
        />
        <div className="w-full grid grid-cols-1 t:grid-cols-2 l-l:grid-cols-3 gap-4">
          {mappedTrainings}
        </div>
      </div>
    </div>
  );
};

export default Training;
