"use client";

import useModalNav from "@/src/hooks/useModalNav";
import { ShowModalInterface } from "@/src/interface/ModalInterface";
import {
  OnboardingContentsSetInterface,
  OnboardingInterface,
} from "@/src/interface/OnboardingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoCaretForwardSharp, IoClose } from "react-icons/io5";
import ModalNav from "../../global/ModalNav";

const ShowOnboarding: React.FC<ShowModalInterface> = (props) => {
  const [onboarding, setOnboarding] = React.useState<
    OnboardingInterface & OnboardingContentsSetInterface
  >({
    title: "",
    description: "",
    required_documents: [],
    policy_acknowledgements: [],
  });

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const getOnboarding = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();
      if (token) {
        const { data } = await axios.get(`${url}/hr/onboarding/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "X-CSRF-TOKEN": token,
          },
          withCredentials: true,
        });

        if (data) {
          setOnboarding(data.onboarding);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const mappedRequiredDocuments = onboarding.required_documents.map(
    (req, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-row items-center justify-start bg-white p-2 rounded-md gap-2 border-2"
        >
          <IoCaretForwardSharp />
          <p className="w-full overflow-y-auto max-h-24 h-full">
            {req.document}
          </p>
        </div>
      );
    }
  );

  const mappedPolicyAcknowledgements = onboarding.policy_acknowledgements.map(
    (ack, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-row items-center justify-start bg-white p-2 rounded-md gap-2 border-2"
        >
          <IoCaretForwardSharp />
          <p className="w-full overflow-y-auto max-h-24 h-full">{ack.policy}</p>
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
            onClick={() => props.setActiveModal(0)}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-4 gap-4 flex flex-col items-center justify-start overflow-hidden">
          <ModalNav
            activeFormPage={activeFormPage}
            pages={["information", "requirements"]}
            handleActiveFormPage={handleActiveFormPage}
          />

          {activeFormPage === "information" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-4">
              <div className="flex flex-col items-start justify-center w-full gap-1">
                <p className="text-xs">Title</p>
                <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-x-auto bg-white">
                  <p>{onboarding.title}</p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-center w-full h-full gap-1">
                <p className="text-xs">Description</p>
                <div className="w-full h-full p-2 px-4 rounded-md border-2 relative overflow-x-auto overflow-y-auto bg-white min-h-40">
                  <p>{onboarding.description}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-start justify-start gap-4 overflow-hidden t:flex-row">
              <div className="w-full h-full flex flex-col items-start justify-start gap-2 rounded-md overflow-hidden">
                <p className="text-xs">Required Documents</p>
                <div className="w-full flex flex-col gap-2 items-center justify-start overflow-y-auto h-full">
                  {mappedRequiredDocuments}
                </div>
              </div>

              <div className="w-full h-full flex flex-col items-start justify-start gap-2 rounded-md overflow-hidden">
                <p className="text-xs">Policy Acknowledgements</p>
                <div className="w-full flex flex-col gap-2 items-center justify-start overflow-y-auto h-full">
                  {mappedPolicyAcknowledgements}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowOnboarding;
