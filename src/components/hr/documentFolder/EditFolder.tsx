import useSelect from "@/src/hooks/useSelect";
import { DocumentFolderInterface } from "@/src/interface/DocumentInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoClose, IoText } from "react-icons/io5";
import Input from "../../form/Input";
import Select from "../../form/Select";

const EditFolder: React.FC<ModalInterface> = (props) => {
  const [folder, setFolder] = React.useState<DocumentFolderInterface>({
    name: "",
    path: 0,
  });
  const [paths, setPaths] = React.useState<{ label: string; value: number }[]>(
    []
  );
  const { activeSelect, toggleSelect } = useSelect();

  const url = process.env.URL;
  const { data } = useSession({ required: true });
  const user = data?.user;

  const handleFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFolder((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handlePaths = (destination: number, label: string) => {
    setFolder((prev) => {
      return {
        ...prev,
        path: { label, value: destination },
      };
    });
  };

  const getFolder = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: folderDetails } = await axios.get(
          `${url}/hr/document_folder/${props.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (folderDetails.folder) {
          setFolder(folderDetails.folder);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const submitUpdateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { token } = await getCSRFToken();

      if (typeof folder.path === "object" && folder.path.value === folder.id) {
        return;
      }

      if (token && user?.token) {
        const { data: updatedFolder } = await axios.patch(
          `${url}/hr/document_folder/${props.id}`,
          {
            name: folder.name,
            path:
              typeof folder.path === "number"
                ? folder.path
                : typeof folder.path === "object"
                ? folder.path.value
                : 0,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (updatedFolder.success) {
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

  const getPaths = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token && typeof folder.path === "number") {
        const { data: folders } = await axios.get<{
          paths: { label: string; value: number }[];
        }>(`${url}/hr/document_folder/paths`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "X-CSRF-TOKEN": token,
          },
          params: { path: folder.path },
          withCredentials: true,
        });

        if (folders.paths) {
          folders.paths.unshift({ label: "Home", value: 0 });
          const folderPaths = folders.paths.filter(
            (path) => path.value !== props.id
          );

          setPaths(folderPaths);

          const pathValue = folders.paths.find((path) => {
            return (
              folder.path &&
              typeof folder.path === "number" &&
              path.value === folder.path
            );
          });

          setFolder((prev) => {
            return {
              ...prev,
              path: pathValue,
            };
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, folder.path, props.id]);

  React.useEffect(() => {
    getFolder();
  }, [getFolder]);

  React.useEffect(() => {
    getPaths();
  }, [getPaths]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex items-center justify-center 
            p-4 t:p-8 z-50 bg-linear-to-b from-accent-yellow/30 to-accent-purple/30 animate-fade"
    >
      <div className="w-full h-auto max-w-(--breakpoint-t) bg-neutral-100 shadow-md rounded-lg ">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Update Folder
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdateFolder(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 t:p-4"
        >
          <Input
            label={true}
            id="name"
            name="name"
            onChange={handleFolder}
            placeholder="Name"
            required={true}
            type="text"
            value={folder.name}
            icon={<IoText />}
          />

          <Select
            id="path"
            name="path"
            activeSelect={activeSelect}
            label={
              folder.path && typeof folder.path === "object"
                ? folder.path.label
                : "Home"
            }
            options={paths}
            placeholder="Path"
            required={true}
            toggleSelect={toggleSelect}
            value={
              folder.path && typeof folder.path === "object"
                ? folder.path.value
                : typeof folder.path === "number"
                ? folder.path
                : 0
            }
            onChange={handlePaths}
          />

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditFolder;
