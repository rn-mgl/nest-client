"use client";

import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  PerformanceReviewContentsSetInterface,
  PerformanceReviewInterface,
} from "@/src/interface/PerformanceReviewInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoCaretForwardSharp, IoClose } from "react-icons/io5";
import ModalNav from "../../global/ModalNav";
import TextBlock from "../../global/field/TextBlock";
import TextField from "../../global/field/TextField";

const ShowPerformanceReview: React.FC<ModalInterface> = (props) => {
  const [performanceReview, setPerformanceReview] = React.useState<
    PerformanceReviewInterface & PerformanceReviewContentsSetInterface
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
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: performanceDetails } = await axios.get(
          `${url}/hr/performance_review/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
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
      <div
        key={index}
        className="w-full flex flex-row items-center justify-start bg-white p-2 rounded-md gap-2 break-words border-2"
      >
        <IoCaretForwardSharp />
        <p className="w-full overflow-y-auto max-h-24">{content.survey}</p>
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

        <div className="w-full h-full p-4 flex flex-col items-center justify-start gap-4 overflow-hidden">
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
