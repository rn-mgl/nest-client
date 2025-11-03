"use client";

import Radio from "@/src/components/global/form/Radio";
import TextBlock from "@/global/field/TextBlock";
import TextField from "@/global/field/TextField";
import ModalTabs from "@/global/navigation/ModalTabs";
import { useToasts } from "@/src/context/ToastContext";
import useModalTab from "@/src/hooks/useModalTab";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  TrainingContentInterface,
  TrainingInterface,
  TrainingReviewInterface,
  UserTrainingInterface,
  UserTrainingResponseInterface,
} from "@/src/interface/TrainingInterface";
import { getCSRFToken } from "@/src/utils/token";
import {
  isCloudFileSummary,
  isUserTrainingResponseSummary,
  normalizeString,
} from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { IoCheckmarkCircle, IoClose, IoCloseCircle } from "react-icons/io5";
import useIsLoading from "@/src/hooks/useIsLoading";
import LogoLoader from "../global/loader/LogoLoader";

const ShowAssignedTraining: React.FC<ModalInterface> = (props) => {
  const [training, setTraining] = React.useState<
    (UserTrainingInterface & { training: TrainingInterface }) | null
  >(null);

  const [contents, setContents] = React.useState<TrainingContentInterface[]>(
    []
  );
  const [reviews, setReviews] = React.useState<
    (TrainingReviewInterface & {
      user_response: UserTrainingResponseInterface | null;
    })[]
  >([]);

  const { addToast } = useToasts();

  const { isLoading, handleIsLoading } = useIsLoading();

  const { data: session } = useSession({ required: true });
  const { activeTab, handleActiveTab } = useModalTab("information");
  const user = session?.user;
  const url = process.env.URL;

  const handleAnswer = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;

    setReviews((prev) => {
      const reviews = [...prev];

      reviews[index] = {
        ...reviews[index],
        user_response: {
          ...(reviews[index].user_response ?? {
            answer: 0,
            created_at: "",
            deleted_at: null,
            response_from: user?.current ?? 0,
            training_review_id: reviews[index].id ?? 0,
            updated_at: "",
          }),
          answer: Number(value),
        },
      };

      return reviews;
    });
  };

  const getTraining = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          training: UserTrainingInterface & {
            training: TrainingInterface & {
              reviews: (
                | TrainingReviewInterface & {
                    user_response: UserTrainingResponseInterface | null;
                  }
              )[];
              contents: TrainingContentInterface[];
            };
          };
        }>(`${url}/training/assigned/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });

        if (responseData.training) {
          const {
            training: { reviews, contents, ...training },
            ...userTraining
          } = responseData.training;

          setTraining({ ...userTraining, training });
          setReviews(reviews);
          setContents(
            contents.map((content) => {
              if (typeof content.content === "string") {
                content.type = "text";
              } else if (isCloudFileSummary(content.content)) {
                const mimeType = content.content.mime_type.split("/")[0];

                content.type = [
                  "text",
                  "image",
                  "video",
                  "application",
                  "audio",
                ].includes(mimeType)
                  ? (mimeType as
                      | "text"
                      | "image"
                      | "video"
                      | "application"
                      | "audio")
                  : "text";
              }

              return content;
            })
          );
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the training data is being retrieved.";
        addToast("Training Error", message, "error");
      }
    }
  }, [url, user?.token, props.id, addToast]);

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      handleIsLoading(true);
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/training/assigned/review-response`,
          {
            reviews: reviews
              .filter((review) => review.user_response !== null)
              .map((review) => ({
                training_review_id: review.id ?? 0,
                user_answer: review.user_response?.answer,
              })),
            training_id: training?.training.id,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          addToast(
            "Response Submitted",
            `Review response has been updated.`,
            "success"
          );
          await getTraining();
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the reviews are being submitted.";

        addToast("Training Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
    }
  };

  const mappedContents = contents.map((content, index) => {
    const currentContent = isCloudFileSummary(content.content)
      ? content.content.url
      : typeof content.content === "string"
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
        ) : content.type === "application" ? (
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

  const mappedReviews = reviews.map((review, index) => {
    const alreadyAnswered =
      review.user_response !== null &&
      isUserTrainingResponseSummary(review.user_response) &&
      review.user_response.id;

    const isCorrect = review.answer === review?.user_response?.answer;

    const mappedChoices = [1, 2, 3, 4].map((choice) => {
      const currChoice =
        review[`choice_${choice}` as keyof TrainingReviewInterface];

      const isChoiceSelected = review?.user_response?.answer === choice;

      return (
        <div
          key={`${currChoice}-${choice}`}
          className="w-full flex flex-row items-center justify-between gap-2 "
        >
          {alreadyAnswered ? (
            <div className="p-1 rounded-md bg-white border-2">
              <div
                className={`p-4 rounded-sm ${
                  isChoiceSelected ? "bg-accent-green" : "bg-white"
                }`}
              ></div>
            </div>
          ) : (
            <Radio
              name={`question_${index}_answer`}
              value={choice}
              isChecked={isChoiceSelected}
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
        key={`${review.question}-${review.answer}`}
        className="w-full flex flex-col items-center justify-center gap-2"
      >
        <div className="w-full border-b-accent-blue border-b-2 py-2 flex flex-row items-center justify-start gap-2">
          <p>
            {alreadyAnswered ? (
              isCorrect ? (
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
      {isLoading ? <LogoLoader /> : null}
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
          <ModalTabs
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
            tabs={["information", "contents", "reviews"]}
          />
          {activeTab === "information" ? (
            <div className="w-full flex flex-col items-center justify-start gap-4 h-full">
              <TextField
                label="Title"
                value={training?.training?.title ?? ""}
              />
              <TextField
                label="Deadline"
                value={training?.deadline ?? "No Deadline"}
              />
              <TextField
                label="Status"
                value={normalizeString(training?.status ?? "")}
              />
              <TextBlock
                label="Description"
                value={training?.training?.description ?? ""}
              />
            </div>
          ) : activeTab === "contents" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
              {mappedContents}
            </div>
          ) : activeTab === "reviews" ? (
            <form
              onSubmit={(e) => submitReview(e)}
              className="w-full h-full flex flex-col items-start justify-start gap-2 overflow-y-auto"
            >
              {training?.score !== null ? (
                <div className="p-2 rounded-md bg-accent-purple font-bold text-white text-sm">
                  Score:{" "}
                  <span className="text-accent-yellow">{training?.score}</span>{" "}
                  / {reviews.length}
                </div>
              ) : null}

              {mappedReviews}

              {training?.score === null ? (
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

export default ShowAssignedTraining;
