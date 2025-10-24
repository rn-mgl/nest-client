import {
  FolderInterface,
  DocumentInterface,
} from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import axios, { isAxiosError } from "axios";

import TextBlock from "@/global/field/TextBlock";
import TextField from "@/global/field/TextField";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { isCloudFileSummary } from "@/src/utils/utils";
import { useToasts } from "@/src/context/ToastContext";

const ShowDocument: React.FC<ModalInterface> = (props) => {
  const [document, setDocument] = React.useState<
    DocumentInterface & { folder: FolderInterface | null }
  >({
    title: "",
    document: null,
    description: "",
    path: 0,
    created_by: 0,
    folder: null,
  });

  const { addToast } = useToasts();

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const getDocumentDetails = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: documentDetails } = await axios.get(
          `${url}/document/resource/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );
        if (documentDetails.document) {
          setDocument(documentDetails.document);
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the document data is being retrieved";
        addToast("Document Error", message, "error");
      }
    }
  }, [props.id, url, user?.token, addToast]);

  React.useEffect(() => {
    getDocumentDetails();
  }, [getDocumentDetails]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
        p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full h-full my-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Document Details"}
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full h-full p-2 rounded-b-md flex flex-col items-center justify-start gap-4 t:p-4">
          <TextField label="Name" value={document.title} />
          <TextBlock label="Description" value={document.description} />
          <TextField
            label="Path"
            value={
              document.folder && document.folder?.title
                ? document.folder?.title
                : "Home"
            }
          />

          <div className="w-full p-2 rounded-md border-2 bg-white flex flex-row items-center justify-start">
            <Link
              href={
                isCloudFileSummary(document.document)
                  ? document.document.url
                  : ""
              }
              target="_blank"
              className="flex flex-row items-center justify-center gap-2 group transition-all hover:underline underline-offset-2"
            >
              <div className="text-2xl aspect-square rounded-xs bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
                <AiFillFilePdf className="text-white" />
              </div>
              <span className="group-hover:underline underline-offset-2 transition-all text-sm">
                View {document.title} Document
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDocument;
