"use client";

import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  EmployeeTrainingInterface,
  EmployeeTrainingReviewResponseInterface,
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
import { IoCheckmarkCircle, IoClose, IoCloseCircle } from "react-icons/io5";
import Radio from "../../form/Radio";
import TextBlock from "../../global/field/TextBlock";
import TextField from "../../global/field/TextField";
import ModalNav from "../../global/ModalNav";

const ShowTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<
    TrainingInterface &
      EmployeeTrainingInterface & {
        contents: TrainingContentInterface[];
        reviews: (TrainingReviewInterface &
          EmployeeTrainingReviewResponseInterface)[];
      }
  >({
    title: "",
    certificate: "",
    contents: [],
    reviews: [],
    deadline: "",
    deadline_days: 0,
    description: "",
    status: "",
    score: null,
  });

  const { data: session } = useSession({ required: true });
  const { activeFormPage, handleActiveFormPage } = useModalNav("information");
  const user = session?.user;
  const url = process.env.URL;

  const handleAnswer = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;

    setTraining((prev) => {
      prev["reviews"][index] = {
        ...prev["reviews"][index],
        employee_answer: parseInt(value),
      };

      return { ...prev };
    });
  };

  const getTraining = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_training/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.training) {
          setTraining(responseData.training);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/employee/employee_training_review_response`,
          { reviews: training.reviews, training_id: training.training_id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          await getTraining();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedContents = training.contents.map((content, index) => {
    const currentContent =
      content.content && typeof content.content === "string"
        ? content.content
        : "";

    return (
      <div
        key={index}
        className="w-full flex flex-col items-center justify-center gap-2"
      >
        <TextField label="Title" value={content.title} />
        <TextBlock label="Description" value={content.description} />
        {content.type === "text" ? (
          <TextBlock label="Content" value={currentContent} />
        ) : content.type === "image" ? (
          <div className="w-full p-2 rounded-md bg-white border-2">
            <Link
              href={currentContent}
              target="_blank"
              className="hover:brightness-90 transition-all"
            >
              <Image
                src={currentContent}
                alt="content"
                width={1920}
                height={1920}
                className="w-full rounded-md"
              />
            </Link>
          </div>
        ) : content.type === "video" ? (
          <div className="w-full p-2 rounded-md bg-white border-2">
            <video src={currentContent} controls className="rounded-md"></video>
          </div>
        ) : content.type === "audio" ? (
          <div className="w-full p-2 rounded-md bg-white border-2">
            <audio src={currentContent} controls={true} />
          </div>
        ) : content.type === "file" ? (
          <div className="w-full p-2 rounded-md border-2 bg-white flex flex-row items-center justify-start">
            <Link
              href={currentContent}
              target="_blank"
              className="flex flex-row items-center justify-center gap-2 group transition-all hover:underline underline-offset-2"
            >
              <div className="text-2xl aspect-square rounded-xs bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
                <AiFillFilePdf className="text-white" />
              </div>
              <span className="group-hover:underline underline-offset-2 transition-all text-sm">
                View {content.title} Document
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    );
  });

  const mappedReviews = training.reviews.map((review, index) => {
    const alreadyAnswered =
      review.employee_training_review_response_id !== null;

    const mappedChoices = [1, 2, 3, 4].map((choice, index2) => {
      const currChoice =
        review[`choice_${choice}` as keyof TrainingReviewInterface];

      return (
        <div
          key={index2}
          className="w-full flex flex-row items-center justify-between gap-2 "
        >
          {alreadyAnswered ? (
            <div className="p-1 rounded-md bg-white border-2">
              <div
                className={`p-4 rounded-sm ${
                  review.employee_answer === choice
                    ? "bg-accent-green"
                    : "bg-white"
                }`}
              ></div>
            </div>
          ) : (
            <Radio
              name={`question_${index}_answer`}
              value={choice}
              isChecked={review.employee_answer === choice}
              onChange={(e) => handleAnswer(e, index)}
            />
          )}

          <div className="w-full p-2 bg-white rounded-md border-2">
            {currChoice}
          </div>
        </div>
      );
    });

    return (
      <div
        key={index}
        className="w-full flex flex-col items-center justify-center gap-2"
      >
        <div className="w-full border-b-accent-blue border-b-2 py-2 flex flex-row items-center justify-start gap-2">
          <p>
            {alreadyAnswered ? (
              review.is_correct ? (
                <IoCheckmarkCircle className="text-accent-green" />
              ) : (
                <IoCloseCircle className="text-red-600" />
              )
            ) : (
              ""
            )}
          </p>
          <p>{index + 1}.</p>
        </div>
        <TextBlock label="Question" value={review.question} />

        <div className="w-full flex flex-col items-center justify-center gap-2">
          {mappedChoices}
        </div>
      </div>
    );
  });

  React.useEffect(() => {
    getTraining();
  }, [getTraining]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
        p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start overflow-hidden">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Training Details"}
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 overflow-hidden t:p-4">
          <ModalNav
            activeFormPage={activeFormPage}
            handleActiveFormPage={handleActiveFormPage}
            pages={["information", "contents", "reviews"]}
          />
          {activeFormPage === "information" ? (
            <div className="w-full flex flex-col items-center justify-start gap-4 h-full">
              <TextField label="Title" value={training.title} />
              <TextField
                label="Deadline"
                value={training.deadline ?? "No Deadline"}
              />
              <TextField label="Status" value={training.status} />
              <TextBlock label="Description" value={training.description} />
            </div>
          ) : activeFormPage === "contents" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
              {mappedContents}
            </div>
          ) : activeFormPage === "reviews" ? (
            <form
              onSubmit={(e) => submitReview(e)}
              className="w-full h-full flex flex-col items-start justify-start gap-2 overflow-y-auto"
            >
              {training.score !== null ? (
                <div className="p-2 rounded-md bg-accent-purple font-bold text-white text-sm">
                  Score:{" "}
                  <span className="text-accent-yellow">{training.score}</span> /{" "}
                  {training.reviews.length}
                </div>
              ) : null}

              {mappedReviews}

              {training.score === null ? (
                <button className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-bold mt-auto">
                  Submit
                </button>
              ) : null}
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShowTraining;
