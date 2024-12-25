import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  PerformanceReviewContentsInterface,
  PerformanceReviewInterface,
} from "@/src/interface/PerformanceReviewInterface";
import useGlobalContext from "@/src/utils/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoClose, IoReader, IoText, IoTrash } from "react-icons/io5";

const CreatePerformanceReview: React.FC<ModalInterface> = (props) => {
  const [performance, setPerformanceReview] = React.useState<
    PerformanceReviewInterface & PerformanceReviewContentsInterface
  >({
    title: "",
    description: "",
    surveys: [""],
  });

  const { url } = useGlobalContext();
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

  const addDynamicFields = (name: string) => {
    setPerformanceReview((prev) => {
      const field = prev[name as keyof object] ?? [];

      const newField = [...field, ""];

      return {
        ...prev,
        [name]: newField,
      };
    });
  };

  const removeDynamicFields = (name: string, index: number) => {
    setPerformanceReview((prev) => {
      const field: Array<string> = prev[name as keyof object];
      field.splice(index, 1);

      return {
        ...prev,
        [name]: field,
      };
    });
  };

  const handleDynamicFields = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;

    setPerformanceReview((prev) => {
      const currentField = prev[name as keyof object];
      const updatedField = [...currentField] as string[];
      updatedField[index] = value;

      return {
        ...prev,
        [name]: [...updatedField],
      };
    });
  };

  const submitCreatePerformanceReview = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken(url);

      if (token && user?.token) {
        const { data: createdPerformanceReview } = await axios.post(
          `${url}/hr/performance`,
          { ...performance },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
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

  const mappedSurveys = performance.surveys.map((survey, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-row gap-2 items-center justify-center"
      >
        <textarea
          name="surveys"
          placeholder={`Survey ${index + 1}`}
          onChange={(e) => handleDynamicFields(e, index)}
          value={survey}
          rows={3}
          className="w-full p-2 px-4 pr-8 rounded-md border-2 outline-none focus:border-neutral-900 transition-all resize-none"
        />

        <button
          type="button"
          onClick={() => removeDynamicFields("surveys", index)}
          className="p-3 border-2 border-neutral-100 rounded-md bg-neutral-100"
        >
          <IoTrash />
        </button>
      </div>
    );
  });

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
          p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-auto max-w-screen-t bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
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
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"
        >
          <Input
            id="title"
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
            onChange={handlePerformanceReview}
            placeholder="Description"
            required={true}
            label={true}
            value={performance.description}
            icon={<IoReader />}
            rows={5}
          />

          <div className="w-full h-full flex flex-col items-center justify-start gap-4 l-s:flex-row l-s:items-start l-s:justify-center">
            <div className="w-full flex flex-col items-center justify-start gap-2 max-h-52 l-l:max-h-64">
              <div className="w-full flex flex-row items-center justify-between">
                <label className="text-xs">Required Documents</label>

                <button
                  type="button"
                  title="Add Required Documents Field"
                  className="p-2 rounded-md bg-neutral-100"
                  onClick={() => addDynamicFields("surveys")}
                >
                  <IoAdd />
                </button>
              </div>

              <div className="w-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
                {mappedSurveys}
              </div>
            </div>
          </div>

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePerformanceReview;
