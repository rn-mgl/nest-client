"use client";

import {
  DocumentFolderInterface,
  DocumentInterface,
} from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import TextField from "../../global/field/TextField";
import TextBlock from "../../global/field/TextBlock";
import Link from "next/link";
import { AiFillFilePdf } from "react-icons/ai";

const ShowDocument: React.FC<ModalInterface> = (props) => {
  const [document, setDocument] = React.useState<
    DocumentInterface & Partial<{ folders: DocumentFolderInterface }>
  >({
    name: "",
    description: "",
    document: "",
    type: "",
    path: 0,
  });

  const url = process.env.URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const getDocumentDetails = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/employee/document/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.document) {
          setDocument(responseData.document);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, props.id, user?.token]);

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
          <TextField label="Name" value={document.name} />
          <TextBlock label="Description" value={document.description} />
          <TextField
            label="Path"
            value={
              document.folders && document.folders?.name
                ? document.folders.name
                : "Home"
            }
          />
          <div className="w-full p-2 rounded-md bg-white border-2 flex flex-col items-start justify-center">
            <Link
              href={document.document as string}
              target="_blank"
              className="flex flex-row items-center justify-center gap-2 group"
            >
              <div className="text-2xl aspect-square rounded-xs bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
                <AiFillFilePdf className="text-neutral-100" />
              </div>
              <span className="group-hover:underline underline-offset-2 transition-all text-sm">
                View {document.name} Document
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDocument;
