"use client";

import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  PerformanceReviewInterface,
  EmployeePerformanceReviewResponseInterface,
  PerformanceReviewSurveyInterface,
} from "@/src/interface/PerformanceReviewInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import TextBlock from "../../global/field/TextBlock";
import useModalNav from "@/src/hooks/useModalNav";
import ModalNav from "../../global/ModalNav";
import TextField from "../../global/field/TextField";
import TextArea from "../../form/TextArea";

const ShowPerformanceReview: React.FC<ModalInterface> = (props) => {
  const [performanceReview, setPerformanceReview] = React.useState<
    PerformanceReviewInterface & {
      contents: (PerformanceReviewSurveyInterface &
        EmployeePerformanceReviewResponseInterface)[];
    }
  >({
    title: "",
    description: "",
    contents: [],
  });

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const { activeFormPage, handleActiveFormPage } = useModalNav("Information");

  const handleSurvey = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    fieldName: string,
    index: number
  ) => {
    const { value } = e.target;

    setPerformanceReview((prev) => {
      const updated = { ...prev };
      updated.contents[index] = {
        ...updated.contents[index],
        [fieldName]: value,
      };

      return updated;
    });
  };

  const getPerformanceReview = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_performance_review/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.performance_review) {
          setPerformanceReview(responseData.performance_review);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const submitPerformanceReviewResponse = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/employee/employee_performance_review_response`,
          { response: performanceReview.contents },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          await getPerformanceReview();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedSurveys = performanceReview.contents.map((content, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-col items-center justify-center gap-2 "
      >
        <TextBlock label={`Survey ${index + 1}`} value={content.survey} />
        <TextArea
          id={`response_${index}`}
          name={`response_${index}`}
          onChange={(e) => handleSurvey(e, "response", index)}
          placeholder="Survey Response"
          required={true}
          value={content.response ?? ""}
        />
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
        <form
          onSubmit={(e) => submitPerformanceReviewResponse(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4 overflow-hidden"
        >
          <ModalNav
            activeFormPage={activeFormPage}
            handleActiveFormPage={handleActiveFormPage}
            pages={["Information", "Survey"]}
          />

          {activeFormPage === "Information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4">
              <TextField label="Title" value={performanceReview.title} />
              <TextBlock
                label="Description"
                value={performanceReview.description}
              />
            </div>
          ) : (
            <>
              <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
                {mappedSurveys}
              </div>

              <button className="w-full p-2 rounded-md bg-accent-blue font-bold text-neutral-100">
                Submit
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ShowPerformanceReview;
