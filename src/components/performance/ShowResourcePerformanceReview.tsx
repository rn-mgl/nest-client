"use client";

import useModalTab from "@/src/hooks/useModalTab";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  PerformanceReviewInterface,
  PerformanceReviewSurveyInterface,
} from "@/src/interface/PerformanceReviewInterface";
import axios, { isAxiosError } from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import ModalTabs from "@/global/navigation/ModalTabs";
import TextBlock from "@/global/field/TextBlock";
import TextField from "@/global/field/TextField";
import { useToasts } from "@/src/context/ToastContext";

const ShowResourcePerformanceReview: React.FC<ModalInterface> = (props) => {
  const [performanceReview, setPerformanceReview] =
    React.useState<PerformanceReviewInterface>({
      title: "",
      description: "",
      created_by: 0,
    });

  const [surveys, setSurveys] = React.useState<
    PerformanceReviewSurveyInterface[]
  >([]);

  const { addToast } = useToasts();

  const { activeTab, handleActiveTab } = useModalTab("information");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;
  const userToken = user?.token;

  const getPerformanceReview = React.useCallback(async () => {
    try {
      if (userToken) {
        const { data: responseData } = await axios.get<{
          performance_review: PerformanceReviewInterface & {
            surveys: PerformanceReviewSurveyInterface[];
          };
        }>(`${url}/performance-review/resource/${props.id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        });

        if (responseData.performance_review) {
          const { surveys, ...performance } = responseData.performance_review;
          setPerformanceReview(performance);
          setSurveys(surveys);
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          `An error occurred when the performance is being retrieved.`;
        addToast("Performance Error", message, "error");
      }
    }
  }, [url, userToken, props.id, addToast]);

  const mappedSurveys = surveys.map((survey) => {
    return (
      <div key={survey.id} className="w-full">
        <TextBlock label="" value={survey.survey} />
      </div>
    );
  });

  React.useEffect(() => {
    getPerformanceReview();
  }, [getPerformanceReview]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Performance Review Details"}
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>

        <div className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 overflow-hidden t:p-4">
          <ModalTabs
            activeTab={activeTab}
            tabs={["information", "surveys"]}
            handleActiveTab={handleActiveTab}
          />

          {activeTab === "information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4">
              <TextField label="Title" value={performanceReview.title} />
              <TextBlock
                label="Description"
                value={performanceReview.description}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-start justify-start gap-1 overflow-hidden">
              <p className="text-xs">Surveys</p>
              <div className="w-full h-full flex flex-col gap-2 items-center justify-start overflow-y-auto">
                {mappedSurveys}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowResourcePerformanceReview;
