import { ModalInterface } from "@/src/interface/ModalInterface";

import Input from "@/src/components/global/form/Input";
import TextArea from "@/src/components/global/form/TextArea";
import useDynamicFields from "@/src/hooks/useDynamicFields";
import useModalTab from "@/src/hooks/useModalTab";
import {
  PerformanceReviewInterface,
  PerformanceReviewSurveyInterface,
} from "@/src/interface/PerformanceReviewInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios, { isAxiosError } from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoClose, IoReader, IoText, IoTrash } from "react-icons/io5";
import ModalTabs from "@/global/navigation/ModalTabs";
import { useToasts } from "@/src/context/ToastContext";

const EditPerformanceReview: React.FC<ModalInterface> = (props) => {
  const [performance, setPerformanceReview] =
    React.useState<PerformanceReviewInterface>({
      title: "",
      description: "",
      created_by: 0,
    });
  const [surveyToDelete, setSurveyToDelete] = React.useState<Array<number>>([]);
  const { addToast } = useToasts();

  const { fields, addField, handleField, populateFields, removeField } =
    useDynamicFields<PerformanceReviewSurveyInterface>([
      {
        created_by: 0,
        survey: "",
      },
    ]);
  const { activeTab, handleActiveTab } = useModalTab("information");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handlePerformanceReview = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setPerformanceReview((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSurveysToDelete = (id: number | undefined) => {
    if (!id) return;
    setSurveyToDelete((prev) => [...prev, id]);
  };

  const getPerformanceReview = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          performance_review: PerformanceReviewInterface & {
            surveys: PerformanceReviewSurveyInterface[];
          };
        }>(`${url}/performance-review/resource/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });

        if (responseData.performance_review) {
          const { surveys, ...performance } = responseData.performance_review;
          populateFields(surveys);
          setPerformanceReview(performance);
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
  }, [url, user?.token, props.id, populateFields, addToast]);

  const mappedSurveys = fields.map((content, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-col gap-2 items-end justify-center"
      >
        <TextArea
          name="survey"
          id={`survey_${index}`}
          required={true}
          label={true}
          icon={<IoReader />}
          placeholder={`Survey ${index + 1}`}
          onChange={(e) => handleField(e, "survey", index)}
          value={content.survey}
          rows={5}
        />

        <button
          type="button"
          onClick={() => {
            removeField(index);
            handleSurveysToDelete(content.id);
          }}
          className="p-2 border-2 border-neutral-100 rounded-md bg-neutral-100"
        >
          <IoTrash />
        </button>
      </div>
    );
  });

  const submitUpdatePerformanceReview = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: updatedPerformanceReview } = await axios.patch(
          `${url}/performance-review/resource/${props.id}`,
          { ...performance, surveys: fields, surveyToDelete },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (updatedPerformanceReview.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          addToast(
            "Performance Updated",
            `${performance.title} has been successfully updated.`,
            "success"
          );
          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          `An error occurred when the performance is being updated.`;
        addToast("Performance Error", message, "error");
      }
    }
  };

  React.useEffect(() => {
    getPerformanceReview();
  }, [getPerformanceReview]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Edit Performance Review
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdatePerformanceReview(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 overflow-hidden t:p-4"
        >
          <ModalTabs
            activeTab={activeTab}
            tabs={["information", "surveys"]}
            handleActiveTab={handleActiveTab}
          />

          {activeTab === "information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4">
              <Input
                id="title"
                name="title"
                placeholder="Title"
                required={true}
                type="text"
                label={true}
                icon={<IoText />}
                value={performance.title}
                onChange={handlePerformanceReview}
              />
              <TextArea
                id="description"
                name="description"
                onChange={handlePerformanceReview}
                placeholder="Description"
                required={true}
                label={true}
                value={performance.description}
                icon={<IoReader />}
                rows={5}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 l-s:items-start l-s:justify-center overflow-hidden">
              <div className="w-full h-full flex flex-col items-center justify-start gap-2 overflow-hidden">
                <div className="w-full flex flex-row items-center justify-between">
                  <button
                    type="button"
                    title="Add Survey Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() => addField({ survey: "", created_by: 0 })}
                  >
                    <IoAdd />
                  </button>
                </div>

                <div className="w-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
                  {mappedSurveys}
                </div>
              </div>
            </div>
          )}

          <button className="t:col-span-2 w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPerformanceReview;
