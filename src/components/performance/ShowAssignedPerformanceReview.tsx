"use client";

import TextBlock from "@/global/field/TextBlock";
import TextField from "@/global/field/TextField";
import ModalTabs from "@/global/navigation/ModalTabs";
import TextArea from "@/src/components/global/form/TextArea";
import { useToasts } from "@/src/context/ToastContext";
import useIsLoading from "@/src/hooks/useIsLoading";
import useModalTab from "@/src/hooks/useModalTab";
import {
  AssignedModalInterface,
  ModalInterface,
} from "@/src/interface/ModalInterface";
import {
  PerformanceReviewInterface,
  PerformanceReviewSurveyInterface,
  UserPerformanceReviewInterface,
  UserPerformanceReviewSurveyResponseInterface,
} from "@/src/interface/PerformanceReviewInterface";
import { getCSRFToken } from "@/src/utils/token";
import {
  isUserPerformanceReviewResponse,
  normalizeString,
} from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoCheckmark, IoChevronDown, IoClose } from "react-icons/io5";
import Select from "../global/form/Select";
import LogoLoader from "../global/loader/LogoLoader";

const ShowAssignedPerformanceReview: React.FC<
  ModalInterface & AssignedModalInterface
> = (props) => {
  const [performanceReview, setPerformanceReview] =
    React.useState<UserPerformanceReviewInterface | null>(null);

  const [surveys, setSurveys] = React.useState<
    (PerformanceReviewSurveyInterface & {
      user_response: UserPerformanceReviewSurveyResponseInterface | null;
    })[]
  >([]);

  const { addToast } = useToasts();

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const { isLoading, handleIsLoading } = useIsLoading();

  const { activeTab, handleActiveTab } = useModalTab("Information");

  const handleSurvey = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = e.target;

    setSurveys((prev) => {
      const surveys = [...prev];

      surveys[index] = {
        ...surveys[index],
        user_response: {
          ...(surveys[index].user_response ?? {
            performance_review_survey_id: surveys[index].id ?? 0,
            response_from: user?.current ?? 0,
            response: "",
            created_at: "",
            updated_at: "",
            deleted_at: "",
          }),
          response: value,
        },
      };

      return surveys;
    });
  };

  const handleStatus = (value: string | number, label: string) => {
    setPerformanceReview((prev) => {
      if (prev === null) return prev;

      return {
        ...prev,
        status: { label, value: String(value) },
      };
    });
  };

  const getPerformanceReview = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          performance_review: UserPerformanceReviewInterface & {
            performance_review: PerformanceReviewInterface & {
              surveys: (PerformanceReviewSurveyInterface & {
                user_response: UserPerformanceReviewSurveyResponseInterface | null;
              })[];
            };
          };
        }>(`${url}/performance-review/assigned/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });

        if (responseData.performance_review) {
          const {
            performance_review: { surveys, ...performanceReview },
            ...userPerformanceReview
          } = responseData.performance_review;

          setPerformanceReview({
            ...userPerformanceReview,
            performance_review: performanceReview,
          });
          setSurveys(surveys);
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the performance review data is being retrieved.";
        addToast("Performance Review Error", message, "error");
      }
    }
  }, [url, user?.token, props.id, addToast]);

  const submitPerformanceReviewResponse = async (index: number) => {
    try {
      handleIsLoading(true);
      const { token } = await getCSRFToken();

      const survey = surveys[index];

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/performance-review/assigned/review-response`,
          {
            response: survey.user_response?.response,
            survey_id: survey.id,
            response_id: survey?.user_response?.id ?? null,
            assigned_performance: performanceReview?.id ?? 0,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          addToast(
            "Response Submitted",
            `Review response has been updated.`,
            "success"
          );
          await getPerformanceReview();
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the response is being submitted.";
        addToast("Performance Review Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
    }
  };

  const submitUpdateStatus = async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const status =
          typeof performanceReview?.status === "string"
            ? performanceReview.status
            : typeof performanceReview?.status === "object"
            ? performanceReview.status.value
            : "pending";

        const { data: responseData } = await axios.patch(
          `${url}/performance-review/assigned/${performanceReview?.id}`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }

          await getPerformanceReview();

          addToast(
            "Status Update",
            `Status updated to ${normalizeString(status)} successfully`,
            "success"
          );
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
        const message = error.response?.data.message ?? error.message;

        addToast("Status Error", message, "error");
      }
    }
  };

  const mappedSurveys = surveys.map((survey, index) => {
    const hasResponse = isUserPerformanceReviewResponse(survey.user_response);

    return (
      <div
        key={survey.id}
        className="w-full flex flex-col items-center justify-center gap-2 "
      >
        <TextBlock label={`Survey ${index + 1}`} value={survey.survey} />

        {hasResponse || props.viewSource === "assigner" ? (
          <TextBlock
            label={`Response ${index + 1}`}
            value={survey.user_response?.response ?? ""}
          />
        ) : (
          <TextArea
            id={`response_${index}`}
            name={`response_${index}`}
            onChange={(e) => handleSurvey(e, index)}
            placeholder="Survey Response"
            required={true}
            value={survey?.user_response?.response ?? ""}
            rows={10}
          />
        )}

        {hasResponse ? (
          <div
            className="w-full p-2 rounded-md bg-accent-green text-neutral-100 font-bold 
                               text-center flex flex-row items-center justify-center gap-2"
          >
            Responded <IoCheckmark />
          </div>
        ) : props.viewSource === "assignee" ? (
          <button
            onClick={() => submitPerformanceReviewResponse(index)}
            className="w-full p-2 rounded-md bg-accent-blue font-bold text-neutral-100"
          >
            Send
          </button>
        ) : null}
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
      {isLoading ? <LogoLoader /> : null}
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
            handleActiveTab={handleActiveTab}
            tabs={["Information", "Survey"]}
          />

          {activeTab === "Information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4">
              <TextField
                label="Title"
                value={performanceReview?.performance_review?.title ?? ""}
              />

              {props.viewSource === "assigner" ? (
                <Select
                  onChange={handleStatus}
                  id="status"
                  name="status"
                  options={[
                    { label: "Pending", value: "pending" },
                    { label: "In Progress", value: "in_progress" },
                    { label: "Done", value: "done" },
                  ]}
                  placeholder="Status"
                  required={true}
                  value={
                    typeof performanceReview?.status === "string"
                      ? performanceReview.status
                      : typeof performanceReview?.status === "object"
                      ? performanceReview.status.value
                      : ""
                  }
                  label={true}
                  icon={<IoChevronDown />}
                />
              ) : (
                <TextField
                  label="Status"
                  value={normalizeString(
                    typeof performanceReview?.status === "string"
                      ? performanceReview.status
                      : typeof performanceReview?.status === "object"
                      ? performanceReview.status.value
                      : ""
                  )}
                />
              )}

              <TextBlock
                label="Description"
                value={performanceReview?.performance_review?.description ?? ""}
              />

              {props.viewSource === "assigner" ? (
                <button
                  onClick={submitUpdateStatus}
                  className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-bold mt-2"
                >
                  Update
                </button>
              ) : null}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
              {mappedSurveys}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowAssignedPerformanceReview;
