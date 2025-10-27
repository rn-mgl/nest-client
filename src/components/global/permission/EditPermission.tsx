import { ModalInterface } from "@/src/interface/ModalInterface";
import { PermissionInterface } from "@/src/interface/PermissionInterface";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoBulb, IoClose, IoKey, IoReader, IoText } from "react-icons/io5";
import TextArea from "../form/TextArea";
import Input from "../form/Input";
import { getCSRFToken } from "@/src/utils/token";

const EditPermission: React.FC<ModalInterface> = (props) => {
  const [permission, setPermission] = React.useState<PermissionInterface>({
    action: "",
    created_by: 0,
    description: "",
    name: "",
  });

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const getPermission = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get(
          `${url}/permission/resource/${props.id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
            withCredentials: true,
          }
        );

        if (responseData.permission) {
          setPermission(responseData.permission);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.id, user?.token, url]);

  const handlePermission = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setPermission((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitUpdatePermission = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();

      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.patch(
          `${url}/permission/resource/${props.id}`,
          { ...permission },
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

          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getPermission();
  }, [getPermission]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
    p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-full max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-yellow rounded-t-lg font-bold text-accent-blue">
          Edit Permission
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitUpdatePermission(e)}
          className="w-full h-full p-2 flex flex-col items-center justify-start gap-4 t:p-4"
        >
          <Input
            id="name"
            name="name"
            onChange={handlePermission}
            placeholder="Name"
            required={true}
            type="text"
            value={permission.name}
            icon={<IoText />}
            label={true}
          />

          <div className="flex flex-col items-center justify-center text-xs text-center t:flex-row t:gap-2">
            <IoBulb />
            <p>
              Actions must have the format <i>action.target_resource</i>. e.g.{" "}
              <b>create.performance_resource</b>
            </p>
          </div>

          <Input
            id="action"
            name="action"
            onChange={handlePermission}
            placeholder="Action"
            required={true}
            type="text"
            value={permission.action}
            icon={<IoKey />}
            label={true}
          />

          <TextArea
            id="description"
            name="description"
            onChange={handlePermission}
            placeholder="Description"
            required={true}
            value={permission.description}
            label={true}
            icon={<IoReader />}
          />
          <button className="t:col-span-2 w-full font-bold text-center rounded-md p-2 bg-accent-yellow text-accent-blue mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPermission;
