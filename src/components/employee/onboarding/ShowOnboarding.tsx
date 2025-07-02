import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  EmployeeOnboardingInterface,
  EmployeeOnboardingPolicyAcknowledgementInterface,
  EmployeeOnboardingRequiredDocumentsInterface,
  OnboardingInterface,
  OnboardingPolicyAcknowledgemenInterface,
  OnboardingRequiredDocumentsInterface,
} from "@/src/interface/OnboardingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import ModalNav from "../../global/ModalNav";
import TextBlock from "../../global/field/TextBlock";
import TextField from "../../global/field/TextField";

const ShowOnboarding: React.FC<ModalInterface> = (props) => {
  const [onboarding, setOnboarding] = React.useState<{
    onboarding: OnboardingInterface & EmployeeOnboardingInterface;
    policy_acknowledgements: (OnboardingPolicyAcknowledgemenInterface &
      EmployeeOnboardingPolicyAcknowledgementInterface)[];
    required_documents: (OnboardingRequiredDocumentsInterface &
      EmployeeOnboardingRequiredDocumentsInterface)[];
  }>();

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const getOnboarding = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get<{
          onboarding: OnboardingInterface & EmployeeOnboardingInterface;
          policy_acknowledgements: (OnboardingPolicyAcknowledgemenInterface &
            EmployeeOnboardingPolicyAcknowledgementInterface)[];
          required_documents: (OnboardingRequiredDocumentsInterface &
            EmployeeOnboardingRequiredDocumentsInterface)[];
        }>(`${url}/employee/employee_onboarding/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
          },
          withCredentials: true,
        });

        if (responseData) {
          setOnboarding(responseData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.id, url, user?.token]);

  const handleAcknowledge = async (policy_acknowledgement_id: number) => {
    try {
      if (!policy_acknowledgement_id) return;

      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/employee/employee_onboarding_policy_acknowledgement`,
          { policy_acknowledged: true, policy_acknowledgement_id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          await getOnboarding();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedRequiredDocuments = onboarding?.required_documents.map(
    (document, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-col items-center justify-start gap-2"
        >
          <div className="w-full p-2 rounded-md border-2 bg-white">
            {document.title}
          </div>
          <div className="w-full p-2 rounded-md border-2 bg-white h-40 overflow-y-auto">
            {document.description}
          </div>
        </div>
      );
    }
  );

  const mappedPolicyAcknowledgements = onboarding?.policy_acknowledgements.map(
    (policy, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-col items-center justify-center gap-2 "
        >
          <div className="w-full p-2 rounded-md border-2 bg-white">
            {policy.title}
          </div>
          <div className="w-full p-2 rounded-md border-2 bg-white min-h-40 max-h-80 overflow-y-auto">
            {policy.description}
          </div>

          {!policy.acknowledged ? (
            <button
              className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-bold"
              onClick={() =>
                handleAcknowledge(
                  policy.onboarding_policy_acknowledgement_id ?? 0
                )
              }
            >
              Acknowledge
            </button>
          ) : (
            <div className="w-full p-2 rounded-md border-2 border-accent-purple text-accent-purple text-center">
              Policy Acknowledged
            </div>
          )}
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
        <div className="w-full h-full flex flex-col items-center justify-start gap-4 p-4 overflow-y-hidden">
          <ModalNav
            activeFormPage={activeFormPage}
            handleActiveFormPage={handleActiveFormPage}
            pages={["information", "documents", "policies"]}
          />

          {activeFormPage === "information" ? (
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
          ) : activeFormPage === "documents" ? (
            <div className="w-full h-full flex flex-col items-start justify-start gap-4 overflow-y-hidden">
              <label className="text-xs">Required Documents</label>

              <div className="w-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
                {mappedRequiredDocuments}
              </div>
            </div>
          ) : activeFormPage === "policies" ? (
            <div className="w-full h-full flex flex-col items-start justify-start gap-4 overflow-y-hidden">
              <label className="text-xs">Policy Acknowledgements</label>

              <div className="w-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
                {mappedPolicyAcknowledgements}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShowOnboarding;
