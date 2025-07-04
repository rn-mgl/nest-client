import Input from "@/components/form/Input";
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
import File from "../../form/File";
import Radio from "../../form/Radio";

const CreateTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<TrainingInterface>({
    title: "",
    description: "",
    deadline_days: 30,
    certificate: null,
  });
  const [reviews, setReviews] = React.useState<TrainingReviewInterface[]>([
    {
      answer: 0,
      choice_1: "",
      choice_2: "",
      choice_3: "",
      choice_4: "",
      question: "",
    },
  ]);
  const { activeFormPage, handleActiveFormPage } = useModalNav("information");
  const { fields, addField, removeField, handleField, removeTargetFieldValue } =
    useDynamicFields<TrainingContentInterface>([
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
    setTraining((prev) => {
      return {
        ...prev,
        certificate: null,
      };
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
    reviews.forEach((review, index) => {
      formData.append(`reviews[${index}]`, JSON.stringify(review));
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
        <TextArea
          id="contents"
          name="contents"
          placeholder={`Content ${index + 1}`}
          value={content.content as string}
          rows={5}
          onChange={(e) => handleField(e, "content", index)}
          required={true}
        />
      ) : content.type === "image" ? (
        <File
          id={`imageContent_${index}`}
          name={`imageContent_${index}`}
          label={`Image Content ${index + 1}`}
          accept="image/*"
          type="image"
          file={contentFile.rawFile}
          url={fileURL}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          removeSelectedFile={() => {
            removeTargetFieldValue("content", index);
            removeSelectedFile(index);
          }}
          onChange={(e) => handleField(e, "content", index)}
        />
      ) : content.type === "video" ? (
        <File
          id={`videoContent_${index}`}
          name={`videoContent_${index}`}
          label={`Video Content ${index + 1}`}
          accept="video/*"
          type="video"
          file={contentFile.rawFile}
          url={fileURL}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          removeSelectedFile={() => {
            removeTargetFieldValue("content", index);
            removeSelectedFile(index);
          }}
          onChange={(e) => handleField(e, "content", index)}
        />
      ) : content.type === "file" ? (
        <File
          id={`fileContent_${index}`}
          name={`fileContent_${index}`}
          label={`File Content ${index + 1}`}
          accept=".pdf"
          type="file"
          file={contentFile.rawFile}
          url={fileURL}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          removeSelectedFile={() => {
            removeTargetFieldValue("content", index);
            removeSelectedFile(index);
          }}
          onChange={(e) => handleField(e, "content", index)}
        />
      ) : null;

    return (
      <div
        key={index}
        className="w-full flex flex-row gap-2 items-start justify-center"
      >
        <div className="w-full flex flex-col gap-2 items-start justify-center">
          <div className="w-full border-b-2 border-accent-blue text-accent-blue">
            {index + 1}.
          </div>

          <Input
            type="text"
            id="contents"
            name="contents"
            placeholder={`Title ${index + 1}`}
            value={content.title}
            required={true}
            onChange={(e) => handleField(e, "title", index)}
          />

          <TextArea
            id="contents"
            name="contents"
            placeholder={`Description ${index + 1}`}
            required={true}
            onChange={(e) => handleField(e, "description", index)}
            value={content.description}
            rows={5}
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
          onClick={() => removeReview(index)}
          type="button"
          className="p-2 rounded-md bg-neutral-100"
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
            pages={["information", "contents", "reviews"]}
            handleActiveFormPage={handleActiveFormPage}
          />

          <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto p-2">
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

                <File
                  accept=".pdf"
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
                  removeSelectedFile={removeSelectedCertificate}
                />
              </div>
            ) : activeFormPage === "contents" ? (
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

                <div className="w-full h-full flex flex-col items-center justify-start gap-4 ">
                  {mappedContents}
                </div>
              </div>
            ) : activeFormPage === "reviews" ? (
              <div className="w-full flex flex-col items-center justify-start gap-2">
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
                <div className="w-full flex flex-col items-center justify-start gap-4">
                  {mappedReviews}
                </div>
              </div>
            ) : null}
          </div>

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTraining;
