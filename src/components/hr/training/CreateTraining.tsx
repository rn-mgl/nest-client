import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  TrainingContentsInterface,
  TrainingInterface,
} from "@/src/interface/TrainingInterface";
import Image from "next/image";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import {
  IoClose,
  IoImage,
  IoReader,
  IoText,
  IoTrash,
  IoVideocam,
} from "react-icons/io5";

const CreateTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<
    TrainingInterface & TrainingContentsInterface
  >({
    title: "",
    description: "",
    contents: [{ title: "", description: "", content: "", type: "text" }],
  });
  const [contentFiles, setContentFiles] = React.useState<
    Array<{ rawFile: File; fileURL: string } | null>
  >([null]);

  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

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

    // also splice the content files in the specified index
    setContentFiles(() => {
      const updatedContentFiles = [...contentFiles];
      updatedContentFiles.splice(index, 1);

      return [...updatedContentFiles];
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

  const handleContentFiles = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { files } = e.target;

    if (!files || !files.length) {
      return;
    }

    const file = files[0];

    const url = URL.createObjectURL(file);
    const updatedContentFields = [...contentFiles];
    updatedContentFields[index] = { rawFile: file, fileURL: url };

    setContentFiles(updatedContentFields);
  };

  const removeSelectedFile = (index: number) => {
    setContentFiles(() => {
      const updatedContentFiles = [...contentFiles];
      updatedContentFiles[index] = null;

      return [...updatedContentFiles];
    });

    if (inputRefs.current[index]) {
      inputRefs.current[index].files = null;
      inputRefs.current[index].value = "";
    }
  };

  const mappedContents = training.contents.map((content, index) => {
    const contentFile = contentFiles[index];
    const fileURL = contentFile?.fileURL;

    const dynamicContent =
      content.type === "text" ? (
        <textarea
          name="contents"
          placeholder={`Content ${index + 1}`}
          onChange={(e) => handleDynamicFields(e, "content", index)}
          value={content.content}
          rows={5}
          className="w-full p-2 px-4 pr-8 rounded-md border-2 outline-none focus:border-neutral-900 transition-all resize-none"
        />
      ) : content.type === "image" ? (
        <div className="w-full flex flex-col items-start justify-center gap-2">
          {fileURL && (
            <div className="relative flex flex-col items-center justify-center">
              <Image
                src={fileURL}
                alt="file"
                width={100}
                height={100}
                className="rounded-md w-full"
              />

              <button
                type="button"
                onClick={() => removeSelectedFile(index)}
                className="p-1 rounded-full bg-red-500 shadow-md absolute -top-1 -right-1"
              >
                <IoClose className="text-xs" />
              </button>
            </div>
          )}

          <div className="w-full flex flex-row items-center justify-between">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id={`content_${index}`}
                onChange={(e) => handleContentFiles(e, index)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
              />

              <span>
                <IoImage className="text-accent-blue" />
              </span>
            </label>
          </div>
        </div>
      ) : content.type === "video" ? (
        <div className="w-full flex flex-col items-start justify-center gap-2">
          {fileURL && (
            <div className="relative flex flex-col items-center justify-center">
              <video src={fileURL} controls className="rounded-md w-full" />

              <button
                type="button"
                onClick={() => removeSelectedFile(index)}
                className="p-1 rounded-full bg-red-500 shadow-md absolute -top-1 -right-1"
              >
                <IoClose className="text-xs" />
              </button>
            </div>
          )}

          <label className="cursor-pointer">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              id={`content_${index}`}
              onChange={(e) => handleContentFiles(e, index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
            />

            <span>
              <IoVideocam className="text-accent-blue" />
            </span>
          </label>
        </div>
      ) : content.type === "file" ? (
        <div className="w-full flex flex-col items-start justify-center gap-2">
          {fileURL && (
            <div className="relative flex flex-col items-center justify-center">
              <embed src={fileURL} className="rounded-md w-fit h-fit"></embed>

              <button
                type="button"
                onClick={() => removeSelectedFile(index)}
                className="p-1 rounded-full bg-red-500 shadow-md absolute -top-1 -right-1"
              >
                <IoClose className="text-xs" />
              </button>
            </div>
          )}

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              className="hidden peer-checked"
              id={`content_${index}`}
              onChange={(e) => handleContentFiles(e, index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
            />

            <span>
              <AiFillFilePdf className="text-accent-blue" />
            </span>
          </label>
        </div>
      ) : null;

    return (
      <div
        key={index}
        className="w-full flex flex-row gap-2 items-start justify-center"
      >
        <div className="w-full flex flex-col gap-2 items-start justify-center">
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
            rows={5}
            className="w-full p-2 px-4 pr-8 rounded-md border-2 outline-none focus:border-neutral-900 transition-all resize-none"
          />

          {dynamicContent}
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

  React.useEffect(() => {
    inputRefs.current = training.contents.map((_, i) => {
      return inputRefs.current[i] || null;
    });
  }, [training.contents]);

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
          className="w-full h-full p-4 grid grid-cols-1 gap-4 t:grid-cols-2"
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
            <div className="w-full flex flex-col items-center justify-start max-h-60 t:min-h-[28rem] t:max-h-[28rem] l-l:min-h-[32rem] l-l:max-h-[32rem]">
              <div className="w-full flex flex-row items-center justify-between ">
                <label className="text-xs">Contents</label>

                <div className="flex flex-row items-center justify-start gap-4">
                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-3 rounded-md bg-neutral-100"
                    onClick={() => addDynamicFields("contents", "text")}
                  >
                    <IoText className="text-sm" />
                  </button>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-3 rounded-md bg-neutral-100"
                    onClick={() => addDynamicFields("contents", "image")}
                  >
                    <IoImage className="text-sm" />
                  </button>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-3 rounded-md bg-neutral-100"
                    onClick={() => addDynamicFields("contents", "video")}
                  >
                    <IoVideocam className="text-sm" />
                  </button>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-3 rounded-md bg-neutral-100"
                    onClick={() => addDynamicFields("contents", "file")}
                  >
                    <AiFillFilePdf className="text-sm" />
                  </button>
                </div>
              </div>

              <div className="w-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
                {mappedContents}
              </div>
            </div>
          </div>

          <button className="t:col-span-2 w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTraining;
