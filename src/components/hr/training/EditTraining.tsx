import useModalNav from "@/src/hooks/useModalNav";
import {
  ModalInterface,
  UpdateModalInterface,
} from "@/src/interface/ModalInterface";
import {
  TrainingContentSetInterface,
  TrainingContentsInterface,
  TrainingInterface,
} from "@/src/interface/TrainingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import {
  IoAdd,
  IoCalendar,
  IoClose,
  IoImage,
  IoReader,
  IoText,
  IoTrash,
  IoVideocam,
} from "react-icons/io5";
import Input from "../../form/Input";
import TextArea from "../../form/TextArea";
import ModalNav from "../../global/ModalNav";

const EditTraining: React.FC<ModalInterface & UpdateModalInterface> = (
  props
) => {
  const [training, setTraining] = React.useState<
    TrainingInterface & TrainingContentsInterface
  >({
    title: "",
    description: "",
    certificate: "",
    deadline_days: 30,
    contents: [{ content: "", description: "", title: "", type: "text" }],
  });
  const certificateRef = React.useRef<HTMLInputElement | null>(null);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const getTraining = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: details } = await axios.get(
          `${url}/hr/training/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            },
            withCredentials: true,
          }
        );

        if (details.training) {
          setTraining(details.training);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, url, props.id]);

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

  const removeSelectedCertificate = () => {
    setTraining((prev) => {
      if (typeof prev.certificate === "string") {
        return prev;
      }

      const trainingData = { ...prev };

      trainingData.certificate = null;

      return {
        ...trainingData,
      };
    });

    if (certificateRef.current) {
      certificateRef.current.files = null;
      certificateRef.current.value = "";
    }
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

    const updatedTraining = { ...training };
    updatedTraining.contents[index].content = { rawFile: file, fileURL: url };

    setTraining(updatedTraining);
  };

  const removeSelectedFile = (index: number) => {
    const updatedField = { ...training };
    updatedField.contents[index].content = "";

    setTraining(updatedField);
  };

  const removeDynamicFields = (name: string, index: number) => {
    setTraining((prev) => {
      const updatedField: Array<TrainingContentSetInterface> =
        prev[name as keyof object];
      updatedField.splice(index, 1);

      return {
        ...prev,
        [name]: updatedField,
      };
    });
  };

  const addDynamicFields = (name: string, type: string) => {
    setTraining((prev) => {
      const newField = { content: "", description: "", title: "", type };
      const currentField: Array<TrainingContentSetInterface> =
        prev[name as keyof object];
      const updatedField = [...currentField, newField];

      return {
        ...prev,
        [name]: updatedField,
      };
    });
  };

  const removeUploadedCertificate = () => {
    setTraining((prev) => {
      const trainingData = { ...prev };
      trainingData.certificate = null;

      return {
        ...trainingData,
      };
    });
  };

  const mappedContents = training.contents.map((content, index) => {
    const contentFile = content.content as { rawFile: File; fileURL: string };
    const fileURL = contentFile.fileURL;

    const dynamicContent =
      content.type === "text" ? (
        <textarea
          name="contents"
          placeholder={`Content ${index + 1}`}
          onChange={(e) => handleDynamicFields(e, "content", index)}
          value={content.content as string}
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
            <div className="p-2 w-full rounded-md border-2 bg-white flex flex-col items-center justify-center bg-center bg-cover relative">
              <div className="w-full flex flex-row items-center justify-start gap-2">
                <div className="aspect-square p-2.5 rounded-sm bg-accent-blue/50">
                  <AiFillFilePdf className="text-white text-2xl" />
                </div>
                <p className="truncate text-sm">{contentFile.rawFile.name}</p>
              </div>
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
    getTraining();
  }, [getTraining]);

  React.useEffect(() => {
    inputRefs.current = training.contents.map((_, index) => {
      return inputRefs.current[index] || null;
    });
  }, [training.contents]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
  p-4 t:p-8 z-50 bg-gradient-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-screen-l-s bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
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
          // onSubmit={(e) => submitUpdatePerformanceReview(e)}
          className="w-full h-full p-4 flex flex-col items-center justify-start gap-4"
        >
          <ModalNav
            activeFormPage={activeFormPage}
            handleActiveFormPage={handleActiveFormPage}
            pages={["information", "contents"]}
          />

          {activeFormPage === "information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto p-2">
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

              <Input
                id="deadline_days"
                placeholder="Deadline Days"
                required={true}
                type="number"
                label={true}
                icon={<IoCalendar />}
                value={training.deadline_days}
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

              <div className="w-full flex flex-col items-start justify-center gap-1">
                <label className="text-xs">Certificate</label>

                {/* check if training.certificate instance is the rawFile filURL object */}
                {training.certificate &&
                typeof training.certificate === "object" &&
                training.certificate?.rawFile ? (
                  <div className="p-2 w-full rounded-md border-2 bg-white flex flex-col items-center justify-center bg-center bg-cover relative">
                    <div className="w-full flex flex-row items-center justify-start gap-2">
                      <div className="aspect-square p-2.5 rounded-sm bg-accent-blue/50">
                        <AiFillFilePdf className="text-white text-2xl" />
                      </div>
                      <p className="truncate text-sm">
                        {training.certificate?.rawFile.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeSelectedCertificate}
                      className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-full"
                    >
                      <IoClose className="text-sm" />
                    </button>
                  </div>
                ) : training.certificate &&
                  typeof training.certificate === "string" ? (
                  <div className="w-full h-full p-2 rounded-md border-2 bg-white flex flex-row relative">
                    <Link
                      href={training.certificate}
                      target="_blank"
                      className="flex flex-row items-center justify-center gap-2 group transition-all"
                    >
                      <div className="text-2xl aspect-square rounded-sm bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
                        <AiFillFilePdf className="text-white" />
                      </div>
                      <span className="group-hover:underline underline-offset-2 transition-all text-sm">
                        View {training.title} Certificate
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={removeUploadedCertificate}
                      className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-full"
                    >
                      <IoClose className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="p-2 w-full h-16 rounded-md border-2 bg-white flex flex-row items-center 
                              justify-center  text-accent-purple gap-1"
                  >
                    <span className="text-sm">Attach Certificate</span>
                    <IoAdd />
                  </div>
                )}

                <div className="w-full flex flex-row items-center justify-between">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      name="certificate"
                      className="hidden"
                      ref={certificateRef}
                      onChange={(e) => handleTraining(e)}
                    />

                    <AiFillFilePdf className="text-accent-blue" />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto gap-4 p-2">
              <div className="w-full h-full flex flex-col items-center justify-start t:items-start">
                <div className="w-full flex flex-row items-center justify-between t:w-60">
                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() => addDynamicFields("contents", "text")}
                  >
                    <IoText className="text-sm" />
                  </button>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() => addDynamicFields("contents", "image")}
                  >
                    <IoImage className="text-sm" />
                  </button>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() => addDynamicFields("contents", "video")}
                  >
                    <IoVideocam className="text-sm" />
                  </button>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() => addDynamicFields("contents", "file")}
                  >
                    <AiFillFilePdf className="text-sm" />
                  </button>
                </div>

                <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
                  {mappedContents}
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

export default EditTraining;
