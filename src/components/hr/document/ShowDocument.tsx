import {
  DocumentFolderInterface,
  DocumentInterface,
} from "@/src/interface/DocumentInterface";
import { ShowModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

const ShowDocument: React.FC<ShowModalInterface> = (props) => {
  const [document, setDocument] = React.useState<
    DocumentInterface & { folder: DocumentFolderInterface | null }
  >({
    name: "",
    document: "",
    description: "",
    type: "",
    path: 0,
    folder: null,
  });

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const getDocumentDetails = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: documentDetails } = await axios.get(
          `${url}/hr/document/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
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
    }
  }, [props.id, url, user?.token]);

  React.useEffect(() => {
    getDocumentDetails();
  }, [getDocumentDetails]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
        p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-purple rounded-t-lg font-bold text-neutral-100">
          {props.label ?? "Document Details"}
          <button
            onClick={() => props.setActiveModal(0)}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <div className="w-full p-4 rounded-b-md flex flex-col items-center justify-start gap-4">
          <div className="flex flex-col items-start justify-center w-full gap-1">
            <p className="text-xs">Name</p>
            <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-x-auto bg-white">
              <p>{document.name}</p>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center w-full h-full gap-1">
            <p className="text-xs">Description</p>
            <div className="w-full h-full p-2 px-4 rounded-md border-2 relative overflow-x-auto overflow-y-auto bg-white min-h-40">
              <p>{document.description}</p>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center w-full gap-1">
            <p className="text-xs">Path</p>
            <div className="w-full p-2 px-4 rounded-md border-2 relative overflow-x-auto bg-white">
              <p>
                {document.folder && document.folder.name
                  ? document.folder.name
                  : "Home"}
              </p>
            </div>
          </div>

          <div className="w-full p-2 rounded-md border-2 bg-white flex flex-row items-center justify-start">
            <Link
              href={document.document as string}
              target="_blank"
              className="flex flex-row items-center justify-center gap-2 group transition-all hover:underline underline-offset-2"
            >
              <div className="text-2xl aspect-square rounded-xs bg-accent-purple/50 p-2 group-hover:bg-accent-purple/80 transition-all">
                <AiFillFilePdf className="text-white" />
              </div>
              <span className="group-hover:underline underline-offset-2 transition-all text-sm">
                View {document.name} Certificate
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDocument;
