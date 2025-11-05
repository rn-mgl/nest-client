import File from "@/src/components/global/form/File";
import TextBlock from "@/global/field/TextBlock";
import TextField from "@/global/field/TextField";
import ModalTabs from "@/global/navigation/ModalTabs";
import { useToasts } from "@/src/context/ToastContext";
import useModalTab from "@/src/hooks/useModalTab";
import {
  AssignedModalInterface,
  ModalInterface,
} from "@/src/interface/ModalInterface";
import {
  OnboardingPolicyAcknowledgemenInterface,
  OnboardingRequiredDocumentsInterface,
  UserOnboardingInterface,
  UserOnboardingPolicyAcknowledgemenInterface,
  UserOnboardingRequiredDocumentsInterface,
} from "@/src/interface/OnboardingInterface";
import { getCSRFToken } from "@/src/utils/token";
import {
  isCloudFileSummary,
  isRawFileSummary,
  normalizeString,
} from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { IoCheckmark, IoChevronDown, IoClose } from "react-icons/io5";
import useIsLoading from "@/src/hooks/useIsLoading";
import LogoLoader from "../global/loader/LogoLoader";
import Select from "../global/form/Select";
import useSelect from "@/src/hooks/useSelect";

const ShowAssignedOnboarding: React.FC<
  ModalInterface & AssignedModalInterface
> = (props) => {
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

  const { addToast } = useToasts();

  const { activeTab, handleActiveTab } = useModalTab("information");

  const { isLoading, handleIsLoading } = useIsLoading();

  const { activeSelect, toggleSelect } = useSelect();

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const handleOnboardingStatus = (value: string | number, label: string) => {
    setOnboarding((prev) => {
      if (prev === null) return prev;

      return {
        ...prev,
        status: { value, label },
      };
    });
  };

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
        }>(`${url}/onboarding/assigned/${props.id}`, {
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

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the onboarding data is being retrieved.";
        addToast("Onboarding Error", message, "error");
      }
    }
  }, [props.id, url, user?.token, addToast]);

  const handleAcknowledge = async (policy_acknowledgement_id: number) => {
    try {
      if (!policy_acknowledgement_id) {
        addToast(
          "Invalid Acknowledgement",
          "The policy you tried to acknowledge does not exists",
          "warning"
        );
        return;
      }

      handleIsLoading(true);

      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/onboarding/assigned/policy-acknowledgement`,
          {
            policy_acknowledged: true,
            policy_acknowledgement_id,
            assigned_onboarding: onboarding?.id ?? 0,
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
            "Policy Acknowledged",
            "Policy acknowledged successfully",
            "success"
          );
          await getOnboarding();
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
        const message = error.response?.data.message ?? error.message;

        addToast("Policy Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
    }
  };

  const sendRequiredDocument = async (index: number) => {
    try {
      handleIsLoading(true);

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

        formData.set("assigned_onboarding", (onboarding?.id ?? 0).toString());

        const { data: responseData } = await axios.post(
          `${url}/onboarding/assigned/required-document`,
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

          addToast(
            "Document Submitted",
            "Document submitted successfully",
            "success"
          );
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
        const message = error.response?.data.message ?? error.message;

        addToast("Document Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
    }
  };

  const updateRequiredDocument = async (index: number) => {
    try {
      handleIsLoading(true);

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
          `${url}/onboarding/assigned/required-document/${documentId}`,
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

          addToast(
            "Document Updated",
            "Document updated successfully",
            "success"
          );
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
        const message = error.response?.data.message ?? error.message;

        addToast("Document Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
    }
  };

  const removeUploadedDocument = async (index: number) => {
    try {
      handleIsLoading(true);

      const { token } = await getCSRFToken();

      const targetDocument = requiredDocuments[index];

      if (targetDocument.user_compliance === null) return;

      const documentId = targetDocument.user_compliance.id;

      if (token && user?.token) {
        const { data: responseData } = await axios.delete(
          `${url}/onboarding/assigned/required-document/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
            params: { assigned_onboarding: onboarding?.id ?? 0 },
          }
        );
        if (responseData.success) {
          await getOnboarding();
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
        const message = error.response?.data.message ?? error.message;

        addToast("Document Error", message, "error");
      }
    } finally {
      handleIsLoading(false);
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

  const submitUpdateStatus = async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const status =
          typeof onboarding?.status === "string"
            ? onboarding.status
            : typeof onboarding?.status === "object"
            ? (onboarding.status.value as string)
            : "pending";

        const { data: responseData } = await axios.patch(
          `${url}/onboarding/assigned/${onboarding?.id}`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }

          getOnboarding();

          addToast(
            "Status Update",
            `Status updated to ${normalizeString(status)} successfully`,
            "success"
          );
        }
      }
    } catch (error) {
      console.log(error);
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

        {/* if there is no user compliance yet/the user compliance document is null/has file input content, show input file field */}
        {props.viewSource === "assignee" &&
        (!document.user_compliance ||
          !document.user_compliance.document ||
          isRawFileSummary(document.user_compliance.document)) ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <File
              accept="application/pdf"
              file={
                isRawFileSummary(document.user_compliance?.document)
                  ? document.user_compliance.document.rawFile
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

            {isRawFileSummary(document.user_compliance?.document) ? (
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
        ) : isCloudFileSummary(document.user_compliance?.document) ? (
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

          {props.viewSource === "assignee" &&
          (!policy.user_acknowledgement ||
            !policy.user_acknowledgement.acknowledged) ? (
            <button
              className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 font-bold"
              onClick={() => handleAcknowledge(policy.id ?? 0)}
            >
              Acknowledge
            </button>
          ) : policy.user_acknowledgement &&
            policy.user_acknowledgement.acknowledged ? (
            <div
              className="w-full p-2 rounded-md bg-accent-green text-neutral-100 font-bold 
                        text-center flex flex-row items-center justify-center gap-2"
            >
              Policy Acknowledged <IoCheckmark />
            </div>
          ) : null}
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
      {isLoading ? <LogoLoader /> : null}
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
          <ModalTabs
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
            tabs={["information", "documents", "policies"]}
          />

          {activeTab === "information" ? (
            <div className="w-full flex flex-col items-center justify-start gap-4 h-full">
              <TextField
                label="Title"
                value={onboarding?.onboarding.title as string}
              />

              {props.viewSource === "assigner" ? (
                <div className="w-full relative flex flex-col items-start justify-center">
                  <Select
                    onChange={handleOnboardingStatus}
                    label={true}
                    placeholder="Status"
                    id="status"
                    name="status"
                    required={true}
                    value={
                      typeof onboarding?.status === "string"
                        ? onboarding.status
                        : typeof onboarding?.status === "object"
                        ? onboarding.status.value
                        : ""
                    }
                    activeSelect={activeSelect}
                    toggleSelect={toggleSelect}
                    options={[
                      { label: "Pending", value: "pending" },
                      { label: "In Progress", value: "in_progress" },
                      { label: "Done", value: "done" },
                    ]}
                  />

                  <IoChevronDown className="absolute right-3 translate-y-3 " />
                </div>
              ) : (
                <TextField
                  label="Status"
                  value={normalizeString(
                    typeof onboarding?.status === "string"
                      ? onboarding.status
                      : typeof onboarding?.status === "object"
                      ? onboarding.status.label
                      : ""
                  )}
                />
              )}

              <TextBlock
                label="Description"
                value={onboarding?.onboarding.description as string}
              />

              {props.viewSource === "assignee" ? (
                <button
                  onClick={submitUpdateStatus}
                  className="w-full p-2 rounded-md bg-accent-purple text-neutral-100 mt-4 font-bold"
                >
                  Update
                </button>
              ) : null}
            </div>
          ) : activeTab === "documents" ? (
            <div className="w-full h-full flex flex-col items-start justify-start gap-4 overflow-y-hidden">
              <label className="text-xs">Required Documents</label>

              <div className="w-full flex flex-col items-center justify-start gap-4 overflow-y-auto">
                {mappedRequiredDocuments}
              </div>
            </div>
          ) : activeTab === "policies" ? (
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

export default ShowAssignedOnboarding;
