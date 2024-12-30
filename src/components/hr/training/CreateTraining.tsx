import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  TrainingContentsInterface,
  TrainingInterface,
} from "@/src/interface/TrainingInterface";
import React from "react";
import { IoAdd, IoClose, IoReader, IoText, IoTrash } from "react-icons/io5";

const CreateTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<
    TrainingInterface & TrainingContentsInterface
  >({
    title: "",
    description: "",
    contents: [{ title: "", description: "", content: "", type: "text" }],
  });

  const addDynamicFields = (name: string, type: string) => {
    setTraining((prev) => {
      const newField = { title: "", description: "", content: "", type };
      const currentField = prev[name as keyof object];
      const updatedField = [...currentField, newField];

      return {
        ...prev,
        [name]: [...updatedField],
      };
    });
  };

  const removeDynamicFields = (name: string, index: number) => {
    setTraining((prev) => {
      const updatedField: Array<TrainingContentsInterface> =
        prev[name as keyof object];
      updatedField.splice(index, 1);

      return {
        ...prev,
        [name]: [...updatedField],
      };
    });
  };

  const handleTraining = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTraining((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleDynamicFields = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    target: "title" | "description" | "content",
    index: number
  ) => {
    const { name, value } = e.target;

    setTraining((prev) => {
      const currentField = prev[name as keyof TrainingContentsInterface];
      const updatedField = [...currentField];
      updatedField[index][target] = value;

      return {
        ...prev,
        [name]: [...updatedField],
      };
    });
  };

  const mappedContents = training.contents.map((content, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-row gap-2 items-start justify-center"
      >
        <div className="w-full flex flex-col gap-2 items-center justify-center">
          <input
            type="text"
            name="contents"
            placeholder={`Title ${index + 1}`}
            onChange={(e) => handleDynamicFields(e, "title", index)}
            value={content.title}
            className="w-full p-2 px-4 rounded-md border-2 outline-none focus:border-neutral-900 transition-all"
          />

          <textarea
            name="contents"
            placeholder={`Description ${index + 1}`}
            onChange={(e) => handleDynamicFields(e, "description", index)}
            value={content.description}
            rows={3}
            className="w-full p-2 px-4 pr-8 rounded-md border-2 outline-none focus:border-neutral-900 transition-all resize-none"
          />

          <textarea
            name="contents"
            placeholder={`Content ${index + 1}`}
            onChange={(e) => handleDynamicFields(e, "content", index)}
            value={content.content}
            rows={3}
            className="w-full p-2 px-4 pr-8 rounded-md border-2 outline-none focus:border-neutral-900 transition-all resize-none"
          />
        </div>

        <button
          type="button"
          onClick={() => removeDynamicFields("contents", index)}
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
      <div className="w-full my-auto h-auto max-w-screen-l-s bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Training
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          // onSubmit={(e) => submitCreatePerformanceReview(e)}
          className="w-full h-full p-4 grid grid-cols-1 gap-4 l-s:grid-cols-2"
        >
          <div className="w-full h-full flex flex-col items-center justify-start gap-4">
            <Input
              id="title"
              placeholder="Title"
              required={true}
              type="text"
              label={true}
              icon={<IoText />}
              value={training.title}
              onChange={handleTraining}
            />

            <TextArea
              id="description"
              placeholder="Description"
              value={training.description}
              onChange={handleTraining}
              icon={<IoReader />}
              label={true}
              required={true}
              rows={5}
            />
          </div>

          <div className="w-full h-full flex flex-col items-center justify-start gap-4 l-s:flex-row l-s:items-start l-s:justify-center">
            <div className="w-full flex flex-col items-center justify-start gap-1 max-h-52 l-s:min-h-96 l-l:max-h-64">
              <div className="w-full flex flex-row items-center justify-between">
                <label className="text-xs">Contents</label>

                <button
                  type="button"
                  title="Add Required Documents Field"
                  className="p-3 rounded-md bg-neutral-100"
                  onClick={() => addDynamicFields("contents", "text")}
                >
                  <IoAdd />
                </button>
              </div>

              <div className="w-full flex flex-col items-center justify-start gap-8 overflow-y-auto">
                {mappedContents}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTraining;