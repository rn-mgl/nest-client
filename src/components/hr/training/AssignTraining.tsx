import CheckBox from "@/form/CheckBox";
import Table from "@/global/field/Table";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { AssignedTrainingInterface } from "@/src/interface/TrainingInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";

const AssignTraining: React.FC<ModalInterface> = (props) => {
  const [userTrainings, setUserTrainings] = React.useState<
    AssignedTrainingInterface[]
  >([]);
  const [assignedUsers, setAssignedUsers] = React.useState<number[]>([]);

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const handleAssignedUsers = (id: number) => {
    setAssignedUsers((prev) => {
      if (prev.includes(id)) {
        const removedId = prev.filter((user) => id !== user);

        return removedId;
      } else {
        return [...prev, id];
      }
    });
  };

  const getUserTrainings = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          users: AssignedTrainingInterface[];
        }>(`${url}/hr/user_training`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
          params: { training_id: props.id },
        });

        if (responseData.users) {
          setUserTrainings(responseData.users);
          setAssignedUsers(
            responseData.users
              .filter(
                (user) =>
                  user.assigned_training !== null &&
                  user.assigned_training.deleted_at === null
              )
              .map((user) => user.id)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const mappedUsers = userTrainings.map((user) => {
    const isChecked = assignedUsers.includes(user.id);
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      assign: (
        <CheckBox
          isChecked={isChecked}
          onClick={() => handleAssignedUsers(user.id)}
        />
      ),
    };
  });

  const submitAssignTraining = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/hr/user_training`,
          { user_ids: assignedUsers, training_id: props.id },
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
    getUserTrainings();
  }, [getUserTrainings]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
              p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full max-h-full my-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-green rounded-t-lg font-bold text-neutral-100">
          Assign Leave
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>

        <form
          onSubmit={(e) => submitAssignTraining(e)}
          className="w-full flex h-full flex-col items-center justify-start p-2 gap-4 t:p-4"
        >
          <Table
            color="neutral"
            contents={mappedUsers}
            headers={["First Name", "Last Name", "Email", "Assign"]}
          />

          <button className="w-full p-2 rounded-md bg-accent-green text-neutral-100 mt-2 font-bold">
            Assign
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignTraining;
