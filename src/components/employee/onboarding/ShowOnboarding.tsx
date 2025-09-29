import File from "@/form/File";
import TextBlock from "@/global/field/TextBlock";
import TextField from "@/global/field/TextField";
import ModalNav from "@/global/navigation/ModalNav";
import useModalNav from "@/src/hooks/useModalNav";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  OnboardingPolicyAcknowledgemenInterface,
  OnboardingRequiredDocumentsInterface,
  UserOnboardingInterface,
  UserOnboardingPolicyAcknowledgemenInterface,
  UserOnboardingRequiredDocumentsInterface,
} from "@/src/interface/OnboardingInterface";
import { getCSRFToken } from "@/src/utils/token";
import { isCloudFileSummary, isRawFileSummary } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { IoCheckmark, IoClose } from "react-icons/io5";

const ShowOnboarding: React.FC<ModalInterface> = (props) => {
  const [onboarding, setOnboarding] =
    React.useState<UserOnboardingInterface | null>(null);

  const [requiredDocuments, setRequiredDocuments] = React.useState<
    (OnboardingRequiredDocumentsInterface & {
      user_compliance: UserOnboardingRequiredDocumentsInterface | null;
    })[]
  >([]);

  const [policyAcknowledgements, setPolicyAcknowledgements] = React.useState<
    (OnboardingPolicyAcknowledgemenInterface & {
      user_acknowledgement: UserOnboardingPolicyAcknowledgemenInterface | null;
    })[]
  >([]);

  const requiredDocumentsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  const { activeFormPage, handleActiveFormPage } = useModalNav("information");

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const getOnboarding = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          onboarding: UserOnboardingInterface & {
            onboarding: {
              required_documents: (OnboardingRequiredDocumentsInterface & {
                user_compliance: UserOnboardingRequiredDocumentsInterface | null;
              })[];
              policy_acknowledgements: (OnboardingPolicyAcknowledgemenInterface & {
                user_acknowledgement: UserOnboardingPolicyAcknowledgemenInterface | null;
              })[];
            };
          };
        }>(`${url}/employee/employee_onboarding/${props.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });

        if (responseData.onboarding) {
          const {
            onboarding: {
              policy_acknowledgements,
              required_documents,
              ...onboardingData
            },
            ...userOnboardingData
          } = responseData.onboarding;

          setOnboarding({ ...userOnboardingData, onboarding: onboardingData });
          setRequiredDocuments(required_documents);
          setPolicyAcknowledgements(policy_acknowledgements);
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
        const targetDocument = requiredDocuments[index];

        if (
          targetDocument.user_compliance === null ||
          targetDocument.user_compliance.document === null
        ) {
          return;
        }

        const {
          user_compliance: { document },
          ...requirement
        } = targetDocument;

        if (
          !document ||
          typeof document !== "object" ||
          !isRawFileSummary(document)
        )
          return;

        const formData = new FormData();

        formData.set("document", document.rawFile);

        formData.set(
          "onboarding_required_document_id",
          typeof requirement.id === "number" ? requirement.id.toString() : ""
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
        const targetDocument = requiredDocuments[index];

        // if no file

        if (
          targetDocument.user_compliance === null ||
          !targetDocument.user_compliance?.document
        ) {
          return;
        }

        const {
          user_compliance: { document, id: documentId },
        } = targetDocument;

        if (
          !document ||
          typeof document !== "object" ||
          !isRawFileSummary(document)
        ) {
          return;
        }

        const formData = new FormData();

        formData.set("document", document.rawFile);
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

      const targetDocument = requiredDocuments[index];

      if (targetDocument.user_compliance === null) return;

      const documentId = targetDocument.user_compliance.id;

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

    setRequiredDocuments((prev) => {
      const documents = [...prev];

      documents[index] = {
        ...documents[index],
        user_compliance: {
          ...(documents[index].user_compliance ?? {
            complied_by: user?.current ?? 0,
            document: null,
            required_document_id: 0,
          }),
          document: { rawFile: file, fileURL: url },
        },
      };

      return documents;
    });
  };

  const removeDocument = (index: number) => {
    setRequiredDocuments((prev) => {
      const documents = [...prev];

      if (documents[index].user_compliance === null) {
        return prev;
      }

      documents[index] = {
        ...documents[index],
        user_compliance: {
          ...documents[index].user_compliance,
          document: null,
        },
      };

      return documents;
    });

    if (requiredDocumentsRef.current && requiredDocumentsRef.current[index]) {
      requiredDocumentsRef.current[index].value = "";
      requiredDocumentsRef.current[index].files = null;
    }
  };

  const mappedRequiredDocuments = requiredDocuments.map((document, index) => {
    return (
      <div
        key={index}
        className="w-full flex flex-col items-center justify-start gap-2"
      >
        <TextField label="Title" value={document.title} />
        <TextBlock label="Description" value={document.description} />

        {/* if there is no user compliance yet or the user compliance document is null, show the File input */}
        {!document.user_compliance ||
        !document.user_compliance.document ||
        (document.user_compliance.document &&
          typeof document.user_compliance.document === "object" &&
          isRawFileSummary(document.user_compliance.document)) ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <File
              accept="application/pdf"
              file={
                document.user_compliance &&
                document.user_compliance.document &&
                isRawFileSummary(document.user_compliance.document)
                  ? document.user_compliance?.document.rawFile
                  : null
              }
              ref={(el) => {
                requiredDocumentsRef.current[index] = el;
              }}
              removeSelectedFile={() => removeDocument(index)}
              id={`documentFor${document.id}`}
              label="Document"
              name="required_document"
              onChange={(e) => handleRequiredDocuments(e, index)}
              type="application"
              url=""
            />

            {document.user_compliance &&
            document.user_compliance.document &&
            isRawFileSummary(document.user_compliance.document) ? (
              <button
                type="button"
                onClick={
                  document.user_compliance.id
                    ? () => updateRequiredDocument(index)
                    : () => sendRequiredDocument(index)
                }
                className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-bold"
              >
                {document.user_compliance.id ? "Update" : "Send"}
              </button>
            ) : null}
          </div>
        ) : document.user_compliance.document &&
          typeof document.user_compliance.document === "object" &&
          isCloudFileSummary(document.user_compliance.document) ? (
          <div className="w-full p-3 rounded-md border-2 bg-white flex flex-col items-start justify-center relative">
            <Link
              href={document.user_compliance.document?.url}
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
        ) : null}
      </div>
    );
  });

  const mappedPolicyAcknowledgements = policyAcknowledgements.map(
    (policy, index) => {
      return (
        <div
          key={index}
          className="w-full flex flex-col items-center justify-center gap-2 "
        >
          <TextField label="Title" value={policy.title} />
          <TextBlock label="Description" value={policy.description} />

          {!policy.user_acknowledgement ||
          !policy.user_acknowledgement.acknowledged ? (
            <button
              className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-bold"
              onClick={() => handleAcknowledge(policy.id ?? 0)}
            >
              Acknowledge
            </button>
          ) : (
            <div
              className="w-full p-2 rounded-md bg-accent-green text-neutral-100 font-bold 
                        text-center flex flex-row items-center justify-center gap-2"
            >
              Policy Acknowledged <IoCheckmark />
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
    requiredDocumentsRef.current = requiredDocuments.map((_, index) => {
      return requiredDocumentsRef.current[index] || null;
    });
  }, [requiredDocuments]);

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
