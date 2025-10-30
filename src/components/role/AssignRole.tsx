import { ModalInterface } from "@/src/interface/ModalInterface";
import { RoleInterface } from "@/src/interface/RoleInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { isCloudFileSummary } from "@/src/utils/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import Table from "../global/field/Table";
import CheckBox from "../global/form/CheckBox";
import { getCSRFToken } from "@/src/utils/token";
import { useToasts } from "@/src/context/ToastContext";

const AssignRole: React.FC<ModalInterface> = (props) => {
  const [userRoles, setUserRoles] = React.useState<
    (UserInterface & { role: RoleInterface })[]
  >([]);
  const [assignedUsers, setAssignedUsers] = React.useState<number[]>([]);

  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.URL;

  const { addToast } = useToasts();

  const getUserRoles = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          users: (UserInterface & { role: RoleInterface })[];
        }>(`${url}/role/assignment`, {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
          params: { role_id: props.id },
        });

        if (responseData.users) {
          setUserRoles(responseData.users);
          setAssignedUsers(
            responseData.users
              .filter((user) => user.role !== null)
              .map((user) => user.id)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const handleAssignedUsers = (id: number) => {
    setAssignedUsers((prev) => {
      if (prev.includes(id)) {
        const removedId = prev.filter((user) => user !== id);
        return removedId;
      } else {
        return [...prev, id];
      }
    });
  };

  const submitAssignRoles = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const { token } = await getCSRFToken();

      if (user?.token && token) {
        const { data: responseData } = await axios.post(
          `${url}/role/assignment`,
          { role_id: props.id, user_ids: assignedUsers },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token,
            },
            withCredentials: true,
          }
        );

        if (responseData.success) {
          props.toggleModal();

          addToast("Role Assigned", "Role assigned successfully", "success");
        }
      }
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.code !== "ERR_CANCELED") {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the role is being assigned.";

        addToast("Role Error", message, "error");
      }
    }
  };

  const mappedUserRoles = userRoles.map((user) => {
    const userImage = isCloudFileSummary(user.image);
    const isChecked = assignedUsers.includes(user.id);

    return {
      image: (
        <div
          style={{ backgroundImage: `url(${userImage})` }}
          className="bg-accent-blue aspect-square w-10 rounded-full bg-center bg-cover"
        />
      ),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      assign: (
        <CheckBox
          onClick={() => handleAssignedUsers(user.id)}
          isChecked={isChecked}
        />
      ),
    };
  });

  React.useEffect(() => {
    getUserRoles();
  }, [getUserRoles]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
                p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full max-h-full my-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-green rounded-t-lg font-bold text-neutral-100">
          Assign Role
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitAssignRoles(e)}
          className="w-full p-2 t:p-4 flex flex-col items-center justify-start gap-4 h-full overflow-hidden"
        >
          <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto">
            <Table
              color="neutral"
              contents={mappedUserRoles}
              headers={["Image", "First Name", "Last Name", "Email"]}
            />
          </div>

          <button className="w-full p-2 rounded-md bg-accent-green text-neutral-100 mt-2 font-bold">
            Assign
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignRole;
