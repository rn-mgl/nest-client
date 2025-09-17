import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import ModalNav from "@/global/navigation/ModalNav";
import useDynamicFields from "@/src/hooks/useDynamicFields";
import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  PerformanceReviewInterface,
  PerformanceReviewSurveyInterface,
} from "@/src/interface/PerformanceReviewInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoClose, IoReader, IoText, IoTrash } from "react-icons/io5";

const CreatePerformanceReview: React.FC<ModalInterface> = (props) => {
  const [performance, setPerformanceReview] =
    React.useState<PerformanceReviewInterface>({
      title: "",
      description: "",
      created_by: 0,
    });

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const { addField, fields, handleField, removeField } =
    useDynamicFields<PerformanceReviewSurveyInterface>([
      { survey: "", created_by: user?.current ?? 0 },
    ]);

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  console.log(fields);

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

  const submitCreatePerformanceReview = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      console.log(token);

      if (token && user?.token) {
        const { data: createdPerformanceReview } = await axios.post(
          `${url}/hr/performance_review`,
          { ...performance, surveys: fields },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (createdPerformanceReview.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }

          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedSurveys = fields.map((survey, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-col gap-2 items-end justify-center"
      >
        <TextArea
          id={`survey_${index}`}
          name="surveys"
          placeholder={`Survey ${index + 1}`}
          onChange={(e) => handleField(e, "survey", index)}
          value={survey.survey}
          rows={5}
          required={true}
          icon={<IoReader />}
          label={true}
        />

        <button
          type="button"
          onClick={() => removeField(index)}
          className="p-2 border-2 border-neutral-100 rounded-md bg-neutral-100"
        >
          <IoTrash />
        </button>
      </div>
    );
  });

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
          p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Performance Review
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>

        <form
          onSubmit={(e) => submitCreatePerformanceReview(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 t:p-4 overflow-hidden"
        >
          <ModalNav
            activeFormPage={activeFormPage}
            pages={["information", "survey"]}
            handleActiveFormPage={handleActiveFormPage}
          />

          {activeFormPage === "information" ? (
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
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 l-s:flex-row l-s:items-start l-s:justify-center overflow-hidden">
              <div className="w-full flex flex-col items-center justify-start gap-2 h-full overflow-hidden">
                <div className="w-full flex flex-row items-center justify-between">
                  <button
                    type="button"
                    title="Add Survey Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() =>
                      addField({ survey: "", created_by: user?.current ?? 0 })
                    }
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

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePerformanceReview;
