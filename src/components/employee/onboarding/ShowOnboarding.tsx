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
import ModalNav from "@/global/ModalNav";
import TextBlock from "@/global/field/TextBlock";
import TextField from "@/global/field/TextField";
import File from "@/form/File";
import Link from "next/link";
import { AiFillFilePdf } from "react-icons/ai";

const ShowOnboarding: React.FC<ModalInterface> = (props) => {
  const [onboarding, setOnboarding] = React.useState<{
    onboarding: OnboardingInterface & EmployeeOnboardingInterface;
    policy_acknowledgements: (OnboardingPolicyAcknowledgemenInterface &
      EmployeeOnboardingPolicyAcknowledgementInterface)[];
    required_documents: (OnboardingRequiredDocumentsInterface &
      EmployeeOnboardingRequiredDocumentsInterface)[];
  }>({
    onboarding: {
      title: "",
      description: "",
      employee_onboarding_id: 0,
      status: "",
    },
    policy_acknowledgements: [],
    required_documents: [],
  });

  const requiredDocumentsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const getOnboarding = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          onboarding: OnboardingInterface & EmployeeOnboardingInterface;
          policy_acknowledgements: (OnboardingPolicyAcknowledgemenInterface &
            EmployeeOnboardingPolicyAcknowledgementInterface)[];
          required_documents: (OnboardingRequiredDocumentsInterface &
            EmployeeOnboardingRequiredDocumentsInterface)[];
        }>(`${url}/employee/employee_onboarding/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
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

  const sendRequiredDocument = async (index: number) => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const document = onboarding.required_documents[index];

        const formData = new FormData();
        formData.set(
          "document",
          document.document && typeof document.document === "object"
            ? document.document.rawFile
            : ""
        );
        formData.set(
          "onboarding_required_document_id",
          typeof document.onboarding_required_document_id === "number"
            ? String(document.onboarding_required_document_id)
            : ""
        );

        const { data: responseData } = await axios.post(
          `${url}/employee/employee_onboarding_required_documents`,
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

        if (responseData.success) {
          await getOnboarding();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateRequiredDocument = async (index: number) => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const {
          employee_onboarding_required_document_id: documentId,
          document: newDocument,
        } = onboarding.required_documents[index];

        const formData = new FormData();
        formData.set(
          "document",
          typeof newDocument === "object" && newDocument?.rawFile
            ? newDocument.rawFile
            : ""
        );
        formData.set("_method", "PATCH");

        const { data: responseData } = await axios.post(
          `${url}/employee/employee_onboarding_required_documents/${documentId}`,
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

        if (responseData.success) {
          await getOnboarding();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeUploadedDocument = async (index: number) => {
    try {
      const { token } = await getCSRFToken();

      const documentId =
        onboarding.required_documents[index]
          .employee_onboarding_required_document_id;

      if (token && user?.token) {
        const { data: responseData } = await axios.delete(
          `${url}/employee/employee_onboarding_required_documents/${documentId}`,
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

  const handleRequiredDocuments = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { files } = e.target;

    if (!files || files.length < 1) return;

    const file = files[0];
    const url = URL.createObjectURL(file);

    setOnboarding((prev) => {
      const documents = [...prev.required_documents];
      const newDocumentSet = { rawFile: file, fileURL: url };

      documents[index] = { ...documents[index], document: newDocumentSet };

      return {
        ...prev,
        required_documents: documents,
      };
    });
  };

  const removeDocument = (index: number) => {
    setOnboarding((prev) => {
      const documents = [...prev.required_documents];
      documents[index] = { ...documents[index], document: null };

      return {
        ...prev,
        required_documents: documents,
      };
    });

    if (requiredDocumentsRef.current && requiredDocumentsRef.current[index]) {
      requiredDocumentsRef.current[index].value = "";
      requiredDocumentsRef.current[index].files = null;
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
          {document.employee_onboarding_required_document_id &&
          typeof document.document === "string" ? (
            <div className="w-full p-3 rounded-md border-2 bg-white flex flex-col items-center justify-center relative">
              <Link
                href={document.document}
                target="_blank"
                className="flex flex-row items-center justify-center gap-2 group w-fit"
              >
                <div className="text-2xl aspect-square p-2 rounded-xs bg-accent-purple/50 group-hover:bg-accent-purple/80 transition-all">
                  <AiFillFilePdf className="text-white" />
                </div>
                <span className="text-sm group-hover:underline underline-offset-2">
                  View Attached {document.title} Document
                </span>
              </Link>

              <button
                onClick={() => removeUploadedDocument(index)}
                className="p-1 rounded-full bg-red-600 absolute top-0 right-0"
              >
                <IoClose />
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <File
                accept="application/pdf"
                file={
                  document.document && typeof document.document === "object"
                    ? document.document.rawFile
                    : null
                }
                ref={(el) => {
                  requiredDocumentsRef.current[index] = el;
                }}
                removeSelectedFile={() => removeDocument(index)}
                id={`documentFor${document.onboarding_required_document_id}`}
                label="Document"
                name="required_document"
                onChange={(e) => handleRequiredDocuments(e, index)}
                type="file"
                url=""
              />

              {document.document && typeof document.document === "object" ? (
                <button
                  type="button"
                  onClick={
                    typeof document.employee_onboarding_required_document_id ===
                    "number"
                      ? () => updateRequiredDocument(index)
                      : () => sendRequiredDocument(index)
                  }
                  className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-bold"
                >
                  Send
                </button>
              ) : null}
            </div>
          )}
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

  React.useEffect(() => {
    requiredDocumentsRef.current = onboarding.required_documents.map(
      (_, index) => {
        return requiredDocumentsRef.current[index] || null;
      }
    );
  }, [onboarding.required_documents]);

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
        <div className="w-full h-full flex flex-col items-center justify-start gap-4 p-2 overflow-y-hidden t:p-4">
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
