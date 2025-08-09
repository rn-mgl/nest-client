"use client";

import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  PerformanceReviewInterface,
  PerformanceReviewSurveyInterface,
} from "@/src/interface/PerformanceReviewInterface";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import ModalNav from "@/global/ModalNav";
import TextBlock from "@/global/field/TextBlock";
import TextField from "@/global/field/TextField";

const ShowPerformanceReview: React.FC<ModalInterface> = (props) => {
  const [performanceReview, setPerformanceReview] = React.useState<
    PerformanceReviewInterface & {
      contents: PerformanceReviewSurveyInterface[];
    }
  >({
    title: "",
    description: "",
    contents: [],
  });

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getPerformanceReview = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: performanceDetails } = await axios.get(
          `${url}/hr/performance_review/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );

        if (performanceDetails.performance) {
          setPerformanceReview(performanceDetails.performance);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const mappedSurveys = performanceReview.contents.map((content, index) => {
    return (
      <div key={index} className="w-full">
        <TextBlock label="" value={content.survey} />
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
          <ModalNav
            activeFormPage={activeFormPage}
            pages={["information", "surveys"]}
            handleActiveFormPage={handleActiveFormPage}
          />

          {activeFormPage === "information" ? (
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

export default ShowPerformanceReview;
