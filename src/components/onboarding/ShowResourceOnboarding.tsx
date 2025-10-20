"use client";

import useModalTab from "@/src/hooks/useModalTab";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  OnboardingInterface,
  OnboardingPolicyAcknowledgemenInterface,
  OnboardingRequiredDocumentsInterface,
} from "@/src/interface/OnboardingInterface";
import axios, { isAxiosError } from "axios";

import ModalTabs from "@/global/navigation/ModalTabs";
import TextBlock from "@/global/field/TextBlock";
import TextField from "@/global/field/TextField";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import { useToasts } from "@/src/context/ToastContext";

const ShowResourceOnboarding: React.FC<ModalInterface> = (props) => {
  const [onboarding, setOnboarding] = React.useState<OnboardingInterface>({
    title: "",
    description: "",
    created_by: 0,
  });

  const [requiredDocuments, setRequiredDocuments] = React.useState<
    OnboardingRequiredDocumentsInterface[]
  >([]);
  const [policyAcknowledgements, setPolicyAcknowledgements] = React.useState<
    OnboardingRequiredDocumentsInterface[]
  >([]);

  const { addToast } = useToasts();

  const { activeTab, handleActiveTab } = useModalTab("information");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getOnboarding = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          onboarding: OnboardingInterface & {
            required_documents: OnboardingRequiredDocumentsInterface[];
            policy_acknowledgements: OnboardingPolicyAcknowledgemenInterface[];
          };
        }>(`${url}/onboarding/resource/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials: true,
        });

        if (responseData.onboarding) {
          const { policy_acknowledgements, required_documents, ...onboarding } =
            responseData.onboarding;

          setOnboarding(onboarding);
          setPolicyAcknowledgements(policy_acknowledgements);
          setRequiredDocuments(required_documents);
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          `An error occurred when the onboarding is being retrieved.`;
        addToast("Onboarding Error", message, "error");
      }
    }
  }, [url, user?.token, props.id, addToast]);

  const mappedRequiredDocuments = requiredDocuments.map((req, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-col items-center justify-start rounded-md gap-2"
      >
        <TextField label={`Required Document ${index + 1}`} value={req.title} />
        <TextBlock label="" value={req.description} />
      </div>
    );
  });

  const mappedPolicyAcknowledgements = policyAcknowledgements.map(
    (ack, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-col items-center justify-start rounded-md gap-2 "
        >
          <TextField
            label={`Policy Acknowledgement ${index + 1}`}
            value={ack.title}
          />
          <TextBlock label="" value={ack.description} />
        </div>
      );
    }
  );

  React.useEffect(() => {
    getOnboarding();
  }, [getOnboarding]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
    p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Onboarding Details"}
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-2 gap-4 flex flex-col items-center justify-start overflow-hidden t:p-4">
          <ModalTabs
            activeTab={activeTab}
            tabs={["information", "documents", "acknowledgements"]}
            handleActiveTab={handleActiveTab}
          />

          {activeTab === "information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4">
              <TextField label="Title" value={onboarding.title} />
              <TextBlock label="Description" value={onboarding.description} />
            </div>
          ) : activeTab === "documents" ? (
            <div className="w-full h-full flex flex-col items-start justify-start gap-4 overflow-hidden t:flex-row">
              <div className="w-full h-full flex flex-col items-start justify-start gap-2 rounded-md overflow-hidden">
                <div className="w-full flex flex-col gap-2 items-center justify-start overflow-y-auto h-full">
                  {mappedRequiredDocuments}
                </div>
              </div>
            </div>
          ) : activeTab === "acknowledgements" ? (
            <div className="w-full h-full flex flex-col items-start justify-start gap-4 overflow-hidden t:flex-row">
              <div className="w-full h-full flex flex-col items-start justify-start gap-2 rounded-md overflow-hidden">
                <div className="w-full flex flex-col gap-2 items-center justify-start overflow-y-auto h-full">
                  {mappedPolicyAcknowledgements}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShowResourceOnboarding;
