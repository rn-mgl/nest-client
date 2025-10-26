import { useToasts } from "@/src/context/ToastContext";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { RoleInterface } from "@/src/interface/RoleInterface";
import { getCSRFToken } from "@/src/utils/token";
import { normalizeString } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoBulb, IoClose, IoPricetag } from "react-icons/io5";
import Input from "../global/form/Input";

const CreateRole: React.FC<ModalInterface> = (props) => {
  const [role, setRole] = React.useState<RoleInterface>({
    role: "",
    created_by: 0,
  });

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const { addToast } = useToasts();

  const handleRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRole((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const { token } = await getCSRFToken();

      if (token && user) {
        const { data: responseData } = await axios.post(
          `${url}/role/resource`,
          { ...role },
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

          addToast(
            `Role Created`,
            `${normalizeString(role.role)} has been created successfully`,
            "success"
          );

          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the role is being created";

        addToast("Role Error", message, "error");
      }
    }
  };

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
          p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full my-auto h-fit max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-blue rounded-t-lg font-bold text-accent-yellow">
          Create Onboarding
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-yellow/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitCreateRole(e)}
          className="w-full flex flex-col items-center justify-start gap-2 p-2 t:p-4"
        >
          <div className="flex flex-col items-center justify-center text-xs text-center">
            <IoBulb />
            <p>
              Roles must be unique and uses the snake case pattern. e.g.{" "}
              <b>super_admin</b>
            </p>
          </div>

          <Input
            id="role"
            name="role"
            onChange={handleRole}
            placeholder="Role"
            required={true}
            type="text"
            value={role.role}
            label={true}
            icon={<IoPricetag />}
          />

          <button className="w-full font-bold text-center rounded-md p-2 bg-accent-blue text-accent-yellow mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;
