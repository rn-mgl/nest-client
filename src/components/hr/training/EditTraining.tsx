import Input from "@/components/form/Input";
import Radio from "@/components/form/Radio";
import TextArea from "@/components/form/TextArea";
import ModalNav from "@/components/global/ModalNav";
import useDynamicFields from "@/src/hooks/useDynamicFields";
import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  TrainingContentInterface,
  TrainingInterface,
  TrainingReviewInterface,
} from "@/src/interface/TrainingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

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
import File from "@/components/form/File";

const EditTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<TrainingInterface>({
    title: "",
    description: "",
    certificate: "",
    deadline_days: 30,
  });
  const [reviews, setReviews] = React.useState<TrainingReviewInterface[]>([]);
  const [reviewsToDelete, setReviewsToDelete] = React.useState<number[]>([]);
  const [contentsToDelete, setContentsToDelete] = React.useState<number[]>([]);
  const certificateRef = React.useRef<HTMLInputElement | null>(null);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");
  const {
    fields,
    addField,
    handleField,
    removeField,
    removeTargetFieldValue,
    populateFields,
  } = useDynamicFields<TrainingContentInterface>([]);

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const getTraining = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get<{
          training: TrainingInterface & {
            contents: TrainingContentInterface[];
            reviews: TrainingReviewInterface[];
          };
        }>(`${url}/hr/training/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
          },
          withCredentials: true,
        });

        if (responseData.training) {
          setTraining(responseData.training);
          setReviews(responseData.training.reviews);
          populateFields(responseData.training.contents);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, url, props.id, populateFields]);

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

  const handleReview = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    index: number
  ) => {
    const { value } = e.target;

    setReviews((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "answer" ? parseInt(value) : value,
      };

      return updated;
    });
  };

  const addReview = () => {
    setReviews((prev) => {
      const newField = {
        answer: 0,
        choice_1: "",
        choice_2: "",
        choice_3: "",
        choice_4: "",
        question: "",
      };
      return [...prev, newField];
    });
  };

  const removeReview = (index: number) => {
    setReviews((prev) => prev.filter((_, i) => i !== index));
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
      const formData = new FormData();
      formData.append("title", training.title);
      formData.append("description", training.description);
      formData.append(
        "certificate",
        training.certificate && typeof training.certificate === "object"
          ? training.certificate?.rawFile
          : typeof training.certificate === "string"
          ? training.certificate
          : ""
      );
      formData.append("deadline_days", training.deadline_days.toString());
      fields.forEach((content, index) => {
        const trainingContent = { ...content };
        trainingContent.content =
          typeof content.content === "string" ? content.content : "";

        // handle updated files and unupdated files
        const trainingFile =
          typeof content.content === "object" ? content.content.rawFile : "";

        formData.append(`contents[${index}]`, JSON.stringify(trainingContent));
        formData.append(`contentFile[${index}]`, trainingFile);
      });
      contentsToDelete.forEach((toDelete, index) => {
        formData.append(`contentsToDelete[${index}]`, toDelete.toString());
      });
      reviews.forEach((review, index) => {
        formData.append(`reviews[${index}]`, JSON.stringify(review));
      });
      reviewsToDelete.forEach((review, index) => {
        formData.append(`reviewsToDelete[${index}]`, review.toString());
      });
      formData.append("_method", "PATCH");

      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: updated } = await axios.post(
          `${url}/hr/training/${props.id}`,
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

          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedContents = fields.map((content, index) => {
    const contentFile = content.content;
    const fileURL =
      typeof contentFile === "object"
        ? contentFile.fileURL
        : typeof contentFile === "string"
        ? contentFile
        : "";

    const dynamicContent =
      content.type === "text" ? (
        <TextArea
          id="contents"
          name="contents"
          onChange={(e) => handleField(e, "content", index)}
          placeholder={`Content ${index + 1}`}
          required={true}
          value={content.content as string}
        />
      ) : content.type === "image" ? (
        <div className="w-full flex flex-col items-start justify-center gap-2">
          {fileURL && (
            <div className="relative flex flex-col items-center justify-center w-full">
              <Image
                src={fileURL}
                alt="file"
                width={1500}
                height={1500}
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
                <div className="aspect-square p-2.5 rounded-xs bg-accent-blue/50">
                  <AiFillFilePdf className="text-white text-2xl" />
                </div>
                <p className="truncate text-sm m-s:w-[10ch] m-m:w-[17ch] m-l:w-[20ch] t:w-full">
                  {typeof contentFile === "object"
                    ? contentFile.rawFile.name
                    : `View File`}
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
              accept="application/pdf"
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
          <Input
            id={`content_title_${index}`}
            name={`content_title_${index}`}
            onChange={(e) => handleField(e, "title", index)}
            placeholder={`Title ${index + 1}`}
            type="text"
            required={true}
            value={content.title}
          />

          <TextArea
            id={`content_content_${index}`}
            name={`content_content_${index}`}
            onChange={(e) => handleField(e, "description", index)}
            placeholder={`Description ${index + 1}`}
            value={content.description}
            required={true}
          />

          {dynamicContent}
        </div>

        <button
          type="button"
          onClick={() => {
            removeField(index);
            handleContentsToDelete(content.training_content_id);
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
      const currChoice =
        review[`choice_${choice}` as keyof TrainingReviewInterface] ?? "";

      return (
        <div
          key={index2}
          className="w-full flex flex-row items-center justify-between gap-2"
        >
          <Radio
            name={`question_${index}_answer`}
            onChange={(e) => handleReview(e, "answer", index)}
            value={choice}
            isChecked={review.answer === choice}
          />

          <Input
            id={`choice_${choice}`}
            name={`choice_${choice}`}
            onChange={(e) => handleReview(e, `choice_${choice}`, index)}
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
        className="w-full flex flex-row items-start gap-2 justify-center"
      >
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <div className="w-full border-b-2 border-accent-blue text-accent-blue">
            {index + 1}.
          </div>
          <TextArea
            id={`question_${index}`}
            name={`question_${index}`}
            onChange={(e) => handleReview(e, "question", index)}
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
            removeReview(index);
            handleReviewsToDelete(review.training_review_id);
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
    inputRefs.current = fields.map((_, index) => {
      return inputRefs.current[index] || null;
    });
  }, [fields]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
  p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
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
          <ModalNav
            activeFormPage={activeFormPage}
            handleActiveFormPage={handleActiveFormPage}
            pages={["information", "contents", "reviews"]}
          />

          {activeFormPage === "information" ? (
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
                {training.certificate &&
                typeof training.certificate === "string" ? (
                  <div className="w-full h-full p-2 rounded-md border-2 bg-white flex flex-row relative">
                    <Link
                      href={training.certificate}
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
                    type="file"
                    file={
                      training.certificate &&
                      typeof training.certificate === "object"
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
          ) : activeFormPage === "contents" ? (
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
                      addField({
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
                      addField({
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
                      addField({
                        title: "",
                        content: "",
                        description: "",
                        type: "file",
                      })
                    }
                  >
                    <AiFillFilePdf className="text-sm" />
                  </button>
                </div>

                <div className="w-full h-full flex flex-col items-center justify-start gap-4">
                  {mappedContents}
                </div>
              </div>
            </div>
          ) : activeFormPage === "reviews" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
              <div className="w-full">
                <button
                  onClick={addReview}
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
