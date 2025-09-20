import { FolderInterface } from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import React from "react";
import { IoClose, IoText } from "react-icons/io5";
import Input from "@/form/Input";
import { getCSRFToken } from "@/src/utils/token";
import { useSession } from "next-auth/react";
import axios from "axios";

import { useParams } from "next/navigation";

const CreateFolder: React.FC<ModalInterface> = (props) => {
  const [folder, setFolder] = React.useState<FolderInterface>({
    title: "",
    created_by: 0,
  });

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;
  const params = useParams();
  const folderId = params?.folder_id ?? 0;

  const handleFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFolder((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitCreateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const {
          data: { success },
        } = await axios.post(
          `${url}/hr/folder`,
          { ...folder, path: folderId },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (success) {
          if (props.refetchIndex) {
            props.refetchIndex();
          }
          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
                p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade"
    >
      <div className="w-full h-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Folder
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitCreateFolder(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 t:p-4"
        >
          <Input
            label={true}
            id="title"
            name="title"
            onChange={handleFolder}
            placeholder="Title"
            required={true}
            type="text"
            value={folder.title}
            icon={<IoText />}
          />

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFolder;
