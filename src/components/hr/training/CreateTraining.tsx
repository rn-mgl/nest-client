import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import ModalNav from "@/components/global/ModalNav";
import useDynamicFields from "@/src/hooks/useDynamicFields";
import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  TrainingContentSetInterface,
  TrainingInterface,
} from "@/src/interface/TrainingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import Image from "next/image";
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

const CreateTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<TrainingInterface>({
    title: "",
    description: "",
    deadline_days: 30,
    certificate: null,
  });
  const { activeFormPage, handleActiveFormPage } = useModalNav("information");
  const { fields, addField, removeField, handleField, removeTargetFieldValue } =
    useDynamicFields<TrainingContentSetInterface>([
      {
        content: "",
        title: "",
        type: "text",
        description: "",
      },
    ]);

  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const certificateRef = React.useRef<HTMLInputElement | null>(null);

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const handleTraining = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "certificate") {
      const { files } = e.target as HTMLInputElement;

      if (!files || !files.length) {
        return;
      }

      const file = files[0];
      const url = URL.createObjectURL(file);
      const certificateValue = { rawFile: file, fileURL: url };

      setTraining((prev) => {
        return {
          ...prev,
          [name]: certificateValue,
        };
      });
    } else {
      setTraining((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const removeSelectedCertificate = () => {
    setTraining(() => {
      const updatedTraining = { ...training };
      updatedTraining.certificate = null;

      return { ...updatedTraining };
    });

    if (certificateRef.current) {
      certificateRef.current.files = null;
      certificateRef.current.value = "";
    }
  };

  const removeSelectedFile = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].files = null;
      inputRefs.current[index].value = "";
    }
  };

  const submitCreateTraining = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    const certificate =
      training.certificate && typeof training.certificate === "object"
        ? training.certificate.rawFile
        : "";
    formData.append("title", training.title);
    formData.append("description", training.description);
    formData.append("deadline_days", training.deadline_days.toString());
    formData.append("certificate", certificate);
    fields.forEach((content, index) => {
      // ensure training content is using string value for content kvp
      const trainingContent = {
        title: content.title,
        description: content.description,
        content: typeof content.content === "string" ? content.content : "",
        type: content.type,
      };
      // ensure training file is using rawFile value if it is object
      const trainingFile =
        typeof content.content === "object" && "rawFile" in content.content
          ? content.content.rawFile
          : "";

      formData.append(`contents[${index}]`, JSON.stringify(trainingContent));
      formData.append(`contentFile[${index}]`, trainingFile);
    });

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: createdTraining } = await axios.post(
          `${url}/hr/training`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );

        if (createdTraining.success) {
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

  const mappedContents = fields.map((content, index) => {
    const contentFile = content.content as { rawFile: File; fileURL: string };
    const fileURL = contentFile.fileURL;

    const dynamicContent =
      content.type === "text" ? (
        <textarea
          name="contents"
          placeholder={`Content ${index + 1}`}
          onChange={(e) => handleField(e, "content", index)}
          value={content.content as string}
          rows={5}
          className="w-full p-2 px-4 pr-8 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all resize-none"
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
                onClick={() => {
                  removeTargetFieldValue("content", index);
                  removeSelectedFile(index);
                }}
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
                onChange={(e) => handleField(e, "content", index)}
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
                onClick={() => {
                  removeTargetFieldValue("content", index);
                  removeSelectedFile(index);
                }}
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
              onChange={(e) => handleField(e, "content", index)}
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
        <div className="w-full flex flex-col items-start justify-start gap-2">
          {fileURL && (
            <div className="p-2 w-full rounded-md border-2 bg-white flex flex-col items-start justify-start relative">
              <div className="w-full flex flex-row items-center justify-start gap-2">
                <div className="p-2.5 rounded-xs bg-accent-blue/50">
                  <AiFillFilePdf className="text-white text-2xl" />
                </div>
                <p className="truncate text-sm m-s:w-[10ch] m-m:w-[17ch] m-l:w-[20ch] t:w-full">
                  {contentFile.rawFile.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  removeTargetFieldValue("content", index);
                  removeSelectedFile(index);
                }}
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
              onChange={(e) => handleField(e, "content", index)}
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
            onChange={(e) => handleField(e, "title", index)}
            value={content.title}
            className="w-full p-2 px-4 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all"
          />

          <textarea
            name="contents"
            placeholder={`Description ${index + 1}`}
            onChange={(e) => handleField(e, "description", index)}
            value={content.description}
            rows={5}
            className="w-full p-2 px-4 pr-8 rounded-md border-2 outline-hidden focus:border-neutral-900 transition-all resize-none"
          />

          {dynamicContent}
        </div>

        <button
          type="button"
          onClick={() => removeField(index)}
          className="p-3 border-2 border-neutral-100 rounded-md bg-neutral-100"
        >
          <IoTrash />
        </button>
      </div>
    );
  });

  React.useEffect(() => {
    inputRefs.current = fields.map((_, i) => {
      return inputRefs.current[i] || null;
    });
  }, [fields]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
            p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start overflow-hidden">
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
          onSubmit={(e) => submitCreateTraining(e)}
          className="w-full h-full p-4 flex flex-col gap-4 overflow-hidden items-center justify-start"
        >
          <ModalNav
            activeFormPage={activeFormPage}
            pages={["information", "contents"]}
            handleActiveFormPage={handleActiveFormPage}
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
                      <div className="aspect-square p-2.5 rounded-xs bg-accent-blue/50">
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
                ) : (
                  <label
                    className="p-2 w-full h-16 rounded-md border-2 bg-white flex flex-row items-center 
              justify-center  text-accent-purple gap-1 cursor-pointer"
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      name="certificate"
                      className="hidden"
                      ref={certificateRef}
                      onChange={(e) => handleTraining(e)}
                    />
                    <span className="text-sm">Attach Certificate</span>
                    <IoAdd />
                  </label>
                )}
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
                    onClick={() =>
                      addField({
                        title: "",
                        description: "",
                        content: "",
                        type: "text",
                      })
                    }
                  >
                    <IoText className="text-sm" />
                  </button>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() =>
                      addField({
                        title: "",
                        description: "",
                        content: "",
                        type: "image",
                      })
                    }
                  >
                    <IoImage className="text-sm" />
                  </button>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() =>
                      addField({
                        title: "",
                        description: "",
                        content: "",
                        type: "video",
                      })
                    }
                  >
                    <IoVideocam className="text-sm" />
                  </button>

                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() =>
                      addField({
                        title: "",
                        description: "",
                        content: "",
                        type: "file",
                      })
                    }
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

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTraining;
