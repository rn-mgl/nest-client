import useModalNav from "@/src/hooks/useModalNav";
import { ShowModalInterface } from "@/src/interface/ModalInterface";
import {
  EmployeeOnboardingInterface,
  OnboardingInterface,
  OnboardingPolicyAcknowledgemenInterface,
  OnboardingRequiredDocumentsInterface,
} from "@/src/interface/OnboardingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoCaretForwardSharp, IoClose } from "react-icons/io5";
import ModalNav from "../../global/ModalNav";
import TextField from "../../global/field/TextField";
import TextBlock from "../../global/field/TextBlock";

const ShowOnboarding: React.FC<ShowModalInterface> = (props) => {
  const [onboarding, setOnboarding] = React.useState<
    EmployeeOnboardingInterface & {
      onboarding: OnboardingInterface & {
        policy_acknowledgements: OnboardingPolicyAcknowledgemenInterface[];
        required_documents: OnboardingRequiredDocumentsInterface[];
      };
    }
  >();

  const { activeFormPage, handleActiveFormPage } = useModalNav("Information");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const getOnboarding = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/employee_onboarding/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.onboarding) {
          setOnboarding(responseData.onboarding);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.id, url, user?.token]);

  const mappedRequiredDocuments = onboarding?.onboarding.required_documents.map(
    (document, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-row items-center justify-start bg-white p-2 rounded-md gap-2 border-2"
        >
          <IoCaretForwardSharp />
          <p className="w-full overflow-y-auto max-h-24 h-full">
            {document.document}
          </p>
        </div>
      );
    }
  );

  const mappedPolicyAcknowledgements =
    onboarding?.onboarding.policy_acknowledgements.map((policy, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-row items-center justify-start bg-white p-2 rounded-md gap-2 border-2"
        >
          <IoCaretForwardSharp />
          <p className="w-full overflow-y-auto max-h-24 h-full">
            {policy.policy}
          </p>
        </div>
      );
    });

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
        <div className="w-full h-full flex flex-col items-center justify-start gap-4 p-4 overflow-y-hidden">
          <ModalNav
            activeFormPage={activeFormPage}
            handleActiveFormPage={handleActiveFormPage}
            pages={["Information", "Documents", "Policies"]}
          />

          {activeFormPage === "Information" ? (
            <div className="w-full flex flex-col items-center justify-start gap-4 h-full">
              <TextField
                label="Title"
                value={onboarding?.onboarding.title as string}
              />

              <TextBlock
                label="Description"
                value={onboarding?.onboarding.description as string}
              />
            </div>
          ) : activeFormPage === "Documents" ? (
            <div className="w-full h-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
              {mappedRequiredDocuments}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-start gap-2 overflow-y-auto">
              {mappedPolicyAcknowledgements}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowOnboarding;
