import Input from "@/src/components/global/form/Input";
import Radio from "@/src/components/global/form/Radio";
import TextArea from "@/src/components/global/form/TextArea";
import ModalTabs from "@/global/navigation/ModalTabs";
import useDynamicFields from "@/src/hooks/useDynamicFields";
import useModalTab from "@/src/hooks/useModalTab";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  TrainingContentInterface,
  TrainingInterface,
  TrainingReviewInterface,
} from "@/src/interface/TrainingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios, { isAxiosError } from "axios";

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
import File from "@/src/components/global/form/File";
import { isCloudFileSummary, isRawFileSummary } from "@/src/utils/utils";
import { useToasts } from "@/src/context/ToastContext";
import useIsLoading from "@/src/hooks/useIsLoading";
import LogoLoader from "../global/loader/LogoLoader";

const EditTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<TrainingInterface>({
    title: "",
    description: "",
    certificate: null,
    deadline_days: 30,
    created_by: 0,
  });
  const [reviewsToDelete, setReviewsToDelete] = React.useState<number[]>([]);
  const [contentsToDelete, setContentsToDelete] = React.useState<number[]>([]);

  const certificateRef = React.useRef<HTMLInputElement | null>(null);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const { addToast } = useToasts();

  const { activeTab, handleActiveTab } = useModalTab("information");

  const { isLoading, handleIsLoading } = useIsLoading();

  const {
    fields: contents,
    addField: addContentField,
    handleField: handleContentField,
    removeField: removeContentField,
    removeTargetFieldValue: removeTargetContentFieldValue,
    populateFields: populateContentFields,
  } = useDynamicFields<TrainingContentInterface>([
    {
      content: "",
      description: "",
      title: "",
      type: "text",
    },
  ]);

  const {
    fields: reviews,
    addField: addReviewField,
    handleField: handleReviewField,
    removeField: removeReviewField,
    populateFields: populateReviewFields,
  } = useDynamicFields<TrainingReviewInterface>([
    {
      answer: 0,
      choice_1: "",
      choice_2: "",
      choice_3: "",
      choice_4: "",
      question: "",
    },
  ]);

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const getTraining = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          training: TrainingInterface & {
            contents: TrainingContentInterface[];
            reviews: TrainingReviewInterface[];
          };
        }>(`${url}/training/resource/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });

        if (responseData.training) {
          const { reviews, contents, ...training } = responseData.training;

          setTraining(training);
          populateReviewFields(reviews);
          populateContentFields(
            contents.map((content) => {
              if (isCloudFileSummary(content.content)) {
                const mimeType = content.content.mime_type.split("/")[0];

                content.type = [
                  "text",
                  "image",
                  "video",
                  "application",
                  "audio",
                ].includes(mimeType)
                  ? (mimeType as "text" | "image" | "video" | "application")
                  : "text";
              } else {
                content.type = "text";
              }

              return content;
            })
          );
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          `An error occurred when the training is being retrieved.`;
        addToast("Training Error", message, "error");
      }
    }
  }, [
    user?.token,
    url,
    props.id,
    populateReviewFields,
    populateContentFields,
    addToast,
  ]);

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

      setTraining((prev) => {
        return {
          ...prev,
          [name]: { rawFile: file, fileURL: url },
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

  const handleReviewsToDelete = (id: number | undefined) => {
    if (!id) return;

    setReviewsToDelete((prev) => [...prev, id]);
  };

  const removeCertificate = () => {
    setTraining((prev) => {
      return {
        ...prev,
        certificate: null,
      };
    });

    if (certificateRef.current) {
      certificateRef.current.value = "";
      certificateRef.current.files = null;
    }
  };

  const removeSelectedFile = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].files = null;
      inputRefs.current[index].value = "";
    }
  };

  const handleContentsToDelete = (id: number | undefined) => {
    if (!id) return;
    setContentsToDelete((prev) => [...prev, id]);
  };

  const submitUpdateTraining = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      handleIsLoading(true);
      const formData = new FormData();
      formData.set("title", training.title);

      formData.set("description", training.description);

      formData.set(
        "certificate",
        isRawFileSummary(training.certificate)
          ? training.certificate.rawFile
          : JSON.stringify(training.certificate)
      );

      formData.set("deadline_days", training.deadline_days.toString());

      contents.forEach((content, index) => {
        const trainingContent = { ...content };

        trainingContent.content =
          typeof content.content === "string" ? content.content : "";

        // handle updated files and unupdated files
        let trainingFile = null;

        // if the content type is an object, it's either a raw file or the cloud file
        if (isRawFileSummary(content.content)) {
          trainingFile = content.content.rawFile;
          trainingContent.type = content.content.rawFile.type.split("/")[0] as
            | "text"
            | "image"
            | "video"
            | "application";
        } else if (isCloudFileSummary(content.content)) {
          trainingFile = JSON.stringify(content.content);
          trainingContent.type = content.content.mime_type.split("/")[0] as
            | "text"
            | "image"
            | "video"
            | "application";
        }

        formData.append(`contents[${index}]`, JSON.stringify(trainingContent));
        formData.append(`content_file[${index}]`, trainingFile ?? "");
      });

      contentsToDelete.forEach((toDelete, index) => {
        formData.append(`contents_to_delete[${index}]`, toDelete.toString());
      });

      reviews.forEach((review, index) => {
        formData.append(`reviews[${index}]`, JSON.stringify(review));
      });

      reviewsToDelete.forEach((review, index) => {
        formData.append(`reviews_to_delete[${index}]`, review.toString());
      });

      formData.append("_method", "PATCH");

      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: updated } = await axios.post(
          `${url}/training/resource/${props.id}`,
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

        if (updated.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          addToast(
            "Training Updated",
            `${training.title} has been successfully updated.`,
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
          `An error occurred when the training is being updated.`;
        addToast("Training Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
    }
  };

  const mappedContents = contents.map((content, index) => {
    const cloudFileContent = isCloudFileSummary(content.content)
      ? content.content
      : null;

    const rawFileContent = isRawFileSummary(content.content)
      ? content.content
      : null;

    const dynamicContent =
      content.type === "text" ? (
        <TextArea
          id="content"
          name="content"
          onChange={(e) => handleContentField(e, "content", index)}
          placeholder={`Content ${index + 1}`}
          required={true}
          value={content.content as string}
        />
      ) : content.type === "image" ? (
        <div className="w-full flex flex-col items-start justify-center gap-2">
          {cloudFileContent ? (
            <div className="relative flex flex-col items-center justify-center w-full bg-white rounded-md">
              <Link
                target="_blank"
                href={cloudFileContent.url}
                className="w-full h-full"
              >
                <Image
                  src={cloudFileContent.url}
                  alt="file"
                  width={1500}
                  height={1500}
                  className="rounded-md w-full"
                />
              </Link>

              <button
                type="button"
                onClick={() => {
                  removeTargetContentFieldValue("content", index);
                  removeSelectedFile(index);
                }}
                className="p-1 rounded-full bg-red-500 shadow-md absolute top-1 right-1"
              >
                <IoClose className="text-xs" />
              </button>
            </div>
          ) : (
            <File
              accept="image/*"
              file={rawFileContent ? rawFileContent.rawFile : null}
              id={`trainingContent_${index}`}
              label={`Image Content ${index + 1}`}
              name="content"
              onChange={(e) => handleContentField(e, "content", index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              removeSelectedFile={() => {
                removeSelectedFile(index);
                removeTargetContentFieldValue("content", index);
              }}
              type="image"
              url={rawFileContent ? rawFileContent.fileURL : ""}
            />
          )}
        </div>
      ) : content.type === "video" ? (
        <div className="w-full flex flex-col items-start justify-center gap-2">
          {cloudFileContent ? (
            <div className="relative flex flex-col items-center justify-center">
              <Link href={cloudFileContent.url} target="_blank">
                <video
                  src={cloudFileContent.url}
                  controls
                  className="rounded-md w-full"
                />
              </Link>
              <button
                type="button"
                onClick={() => {
                  removeTargetContentFieldValue("content", index);
                  removeSelectedFile(index);
                }}
                className="p-1 rounded-full bg-red-500 shadow-md absolute top-1 right-1"
              >
                <IoClose className="text-xs" />
              </button>
            </div>
          ) : (
            <File
              accept="video/*"
              type="video"
              file={rawFileContent ? rawFileContent.rawFile : null}
              id={`trainingContent_${index}`}
              label={`Video Content ${index + 1}`}
              name="content"
              onChange={(e) => handleContentField(e, "content", index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              removeSelectedFile={() => {
                removeSelectedFile(index);
                removeTargetContentFieldValue("content", index);
              }}
              url={rawFileContent ? rawFileContent.fileURL : ""}
            />
          )}
        </div>
      ) : content.type === "application" ? (
        <div className="w-full flex flex-col items-start justify-start gap-2">
          {cloudFileContent ? (
            <div className="p-2 w-full rounded-md border-2 bg-white flex flex-col items-start justify-start relative">
              <Link
                target="_blank"
                href={cloudFileContent.url}
                className="w-full flex flex-row items-center justify-start gap-2 group"
              >
                <div className="aspect-square p-2.5 rounded-xs bg-accent-blue/50">
                  <AiFillFilePdf className="text-white text-2xl" />
                </div>
                <p className="truncate text-sm m-s:w-[10ch] m-m:w-[17ch] m-l:w-[20ch] t:w-full group-hover:underline underline-offset-2">
                  View File Content {index + 1}
                </p>
              </Link>

              <button
                type="button"
                onClick={() => {
                  removeTargetContentFieldValue("content", index);
                  removeSelectedFile(index);
                }}
                className="p-1 rounded-full bg-red-500 shadow-md absolute top-1 right-1"
              >
                <IoClose className="text-xs" />
              </button>
            </div>
          ) : (
            <File
              accept="application/pdf"
              file={rawFileContent ? rawFileContent.rawFile : null}
              id={`trainingContent_${index}`}
              label={`File Content ${index + 1}`}
              name="content"
              onChange={(e) => handleContentField(e, "content", index)}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              removeSelectedFile={() => {
                removeSelectedFile(index);
                removeTargetContentFieldValue("content", index);
              }}
              type="application"
              url={rawFileContent ? rawFileContent.fileURL : ""}
            />
          )}
        </div>
      ) : null;

    return (
      <div
        key={index}
        className="w-full flex flex-col gap-2 items-end justify-center"
      >
        <div className="w-full flex flex-col gap-2 items-start justify-center">
          <Input
            id={`content_title_${index}`}
            name={`content_title_${index}`}
            onChange={(e) => handleContentField(e, "title", index)}
            placeholder={`Title ${index + 1}`}
            type="text"
            required={true}
            value={content.title}
          />

          <TextArea
            id={`content_content_${index}`}
            name={`content_content_${index}`}
            onChange={(e) => handleContentField(e, "description", index)}
            placeholder={`Description ${index + 1}`}
            value={content.description}
            required={true}
          />

          {dynamicContent}
        </div>

        <button
          type="button"
          onClick={() => {
            removeContentField(index);
            handleContentsToDelete(content.id);
          }}
          className="p-3 border-2 border-neutral-100 rounded-md bg-neutral-100"
        >
          <IoTrash />
        </button>
      </div>
    );
  });

  const mappedReviews = reviews.map((review, index) => {
    const mappedChoices = [1, 2, 3, 4].map((choice, index2) => {
      const choiceKey = `choice_${choice}` as keyof TrainingReviewInterface;

      const currChoice = review[choiceKey] ?? "";

      return (
        <div
          key={index2}
          className="w-full flex flex-row items-center justify-between gap-2"
        >
          <Radio
            name={`question_${index}_answer`}
            onChange={(e) => handleReviewField(e, "answer", index)}
            value={choice}
            isChecked={review.answer === choice}
          />

          <Input
            id={choiceKey}
            name={choiceKey}
            onChange={(e) => handleReviewField(e, choiceKey, index)}
            placeholder={`Choice ${index2 + 1}`}
            required={true}
            type="text"
            value={currChoice}
          />
        </div>
      );
    });

    return (
      <div
        key={index}
        className="w-full flex flex-col items-end gap-2 justify-center"
      >
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <div className="w-full border-b-2 border-accent-blue text-accent-blue">
            {index + 1}.
          </div>
          <TextArea
            id={`question_${index}`}
            name={`question_${index}`}
            onChange={(e) => handleReviewField(e, "question", index)}
            placeholder={`Question ${index + 1}`}
            required={true}
            value={review.question}
          />
          <div className="w-full flex flex-col items-center justify-center gap-2">
            {mappedChoices}
          </div>
        </div>
        <button
          onClick={() => {
            removeReviewField(index);
            handleReviewsToDelete(review.id);
          }}
          type="button"
          className="p-2 rounded-md bg-neutral-100"
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
    inputRefs.current = contents.map((_, index) => {
      return inputRefs.current[index] || null;
    });
  }, [contents]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
  p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      {isLoading ? <LogoLoader /> : null}
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Edit Training
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdateTraining(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 overflow-hidden t:p-4"
        >
          <ModalTabs
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
            tabs={["information", "contents", "reviews"]}
          />

          {activeTab === "information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto p-2">
              <Input
                id="title"
                name="title"
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
                name="deadline_days"
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
                name="description"
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

                {/* check if training.certificate instance is the uploaded */}
                {isCloudFileSummary(training.certificate) ? (
                  <div className="w-full h-full p-2 rounded-md border-2 bg-white flex flex-row relative">
                    <Link
                      href={training.certificate.url}
                      target="_blank"
                      className="flex flex-row items-center justify-center gap-2 group transition-all"
                    >
                      <div className="text-2xl aspect-square rounded-xs bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
                        <AiFillFilePdf className="text-white" />
                      </div>
                      <span className="group-hover:underline underline-offset-2 transition-all text-sm">
                        View Training Certificate
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={removeCertificate}
                      className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-full"
                    >
                      <IoClose className="text-sm" />
                    </button>
                  </div>
                ) : (
                  <File
                    accept="application/pdf"
                    type="application"
                    file={
                      isRawFileSummary(training.certificate)
                        ? training.certificate.rawFile
                        : null
                    }
                    id="certificate"
                    name="certificate"
                    label="Certificate"
                    onChange={handleTraining}
                    ref={certificateRef}
                    removeSelectedFile={removeCertificate}
                  />
                )}
              </div>
            </div>
          ) : activeTab === "contents" ? (
            <div className="w-full h-full flex flex-col items-center justify-start overflow-hidden gap-4 p-2">
              <div className="w-full h-full flex flex-col items-center justify-start t:items-start">
                <div className="w-full flex flex-row items-center justify-between t:w-60">
                  <button
                    type="button"
                    title="Add Required Documents Field"
                    className="p-2 rounded-md bg-neutral-100"
                    onClick={() =>
                      addContentField({
                        title: "",
                        content: "",
                        description: "",
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
                      addContentField({
                        title: "",
                        content: "",
                        description: "",
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
                      addContentField({
                        title: "",
                        content: "",
                        description: "",
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
                      addContentField({
                        title: "",
                        content: "",
                        description: "",
                        type: "application",
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
          ) : activeTab === "reviews" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
              <div className="w-full">
                <button
                  onClick={() =>
                    addReviewField({
                      answer: 0,
                      choice_1: "",
                      choice_2: "",
                      choice_3: "",
                      choice_4: "",
                      question: "",
                    })
                  }
                  type="button"
                  title="Add Questionnaire"
                  className="p-2 rounded-md bg-neutral-100"
                >
                  <IoAdd />
                </button>
              </div>

              <div className="w-full h-full flex flex-col items-center justify-start gap-4 ">
                {mappedReviews}
              </div>
            </div>
          ) : null}

          <button className="t:col-span-2 w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTraining;
