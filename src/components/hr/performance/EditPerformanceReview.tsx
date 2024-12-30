import {
  ModalInterface,
  UpdateModalInterface,
} from "@/src/interface/ModalInterface";

import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import {
  PerformanceReviewContentsSetInterface,
  PerformanceReviewInterface,
  PerformanceReviewSurveySetInterface,
} from "@/src/interface/PerformanceReviewInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoClose, IoReader, IoText, IoTrash } from "react-icons/io5";

const EditPerformanceReview: React.FC<ModalInterface & UpdateModalInterface> = (
  props
) => {
  const [performance, setPerformanceReview] = React.useState<
    PerformanceReviewInterface & PerformanceReviewContentsSetInterface
  >({
    title: "",
    description: "",
    contents: [],
  });
  const [surveyToDelete, setSurveyToDelete] = React.useState<Array<number>>([]);

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

  const addDynamicFields = (name: string) => {
    setPerformanceReview((prev) => {
      const newField: PerformanceReviewSurveySetInterface = {
        survey: "",
      };
      const currentField = performance[name as keyof object] ?? [];
      const updatedField = [...currentField, newField];

      return {
        ...prev,
        [name]: [...updatedField],
      };
    });
  };

  const removeDynamicFields = (name: string, index: number) => {
    setPerformanceReview((prev) => {
      const updatedField: Array<string> = performance[name as keyof object];
      updatedField.splice(index, 1);

      return {
        ...prev,
        [name]: [...updatedField],
      };
    });
  };

  const handleSurveyToDelete = (id: number | undefined) => {
    if (!id) return;
    setSurveyToDelete((prev) => [...prev, id]);
  };

  const handleDynamicFields = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;

    setPerformanceReview((prev) => {
      const currentField = prev[name as keyof object];
      const updatedField: Array<PerformanceReviewSurveySetInterface> = [
        ...currentField,
      ];

      updatedField[index]["survey"] = value;

      return {
        ...prev,
        [name]: [...updatedField],
      };
    });
  };

  const getPerformanceReview = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: performanceDetails } = await axios.get(
          `${url}/hr/performance_review/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (performanceDetails) {
          setPerformanceReview(performanceDetails.performance);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const mappedSurveys = performance.contents.map((content, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-row gap-2 items-center justify-center"
      >
        <textarea
          name="contents"
          placeholder={`Survey ${index + 1}`}
          onChange={(e) => handleDynamicFields(e, index)}
          value={content.survey}
          rows={3}
          className="w-full p-2 px-4 pr-8 rounded-md border-2 outline-none focus:border-neutral-900 transition-all resize-none"
        />

        <button
          type="button"
          onClick={() => {
            removeDynamicFields("contents", index);
            handleSurveyToDelete(content.performance_review_content_id);
          }}
          className="p-3 border-2 border-neutral-100 rounded-md bg-neutral-100"
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
          `${url}/hr/performance_review/${props.id}`,
          { ...performance, surveyToDelete },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (updatedPerformanceReview.success) {
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

  React.useEffect(() => {
    getPerformanceReview();
  }, [getPerformanceReview]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
      p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-auto max-w-screen-l-s bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
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
          className="w-full h-full p-4 grid grid-cols-1 t:grid-cols-2 gap-4"
        >
          <div className="w-full flex flex-col items-center justify-start gap-4">
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
          </div>

          <div className="w-full h-full flex flex-col items-center justify-start gap-4 l-s:items-start l-s:justify-center">
            <div className="w-full flex flex-col items-center justify-start gap-2 max-h-52 t:min-h-[28rem] t:max-h-[28rem]">
              <div className="w-full flex flex-row items-center justify-between">
                <label className="text-xs">Required Documents</label>

                <button
                  type="button"
                  title="Add Required Documents Field"
                  className="p-2 rounded-md bg-neutral-100"
                  onClick={() => addDynamicFields("contents")}
                >
                  <IoAdd />
                </button>
              </div>

              <div className="w-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
                {mappedSurveys}
              </div>
            </div>
          </div>

          <button className="col-span-2 w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPerformanceReview;
