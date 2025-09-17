import CheckBox from "@/form/CheckBox";
import Table from "@/global/field/Table";
import { ModalInterface } from "@/src/interface/ModalInterface";
import {
  AssignedOnboarding,
  UserOnboardingInterface,
} from "@/src/interface/OnboardingInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";

const AssignOnboarding: React.FC<ModalInterface> = (props) => {
  const [userOnboardings, setUserOnboardings] = React.useState<
    AssignedOnboarding[]
  >([]);

  const [assignedUsers, setAssignedUsers] = React.useState<number[]>([]);

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const handleAssignedUsers = (id: number) => {
    setAssignedUsers((prev) => {
      if (prev.includes(id)) {
        const removedId = prev.filter((assigned) => assigned !== id);
        return removedId;
      } else {
        return [...prev, id];
      }
    });
  };

  const getUserOnboardings = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          users: (UserInterface & {
            assigned_onboarding: null | UserOnboardingInterface;
          })[];
        }>(`${url}/hr/user_onboarding`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
          params: { onboarding_id: props.id },
        });
        if (responseData.users) {
          setUserOnboardings(responseData.users);
          setAssignedUsers(
            responseData.users
              .filter(
                (user) =>
                  user.assigned_onboarding !== null &&
                  user.assigned_onboarding.deleted_at === null
              )
              .map((user) => user.id)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const mappedUserOnboardings = userOnboardings.map((user) => {
    const isChecked = assignedUsers.includes(user.id);

    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      assign: (
        <div className="flex flex-col items-start justify-center">
          <CheckBox
            isChecked={isChecked}
            onClick={() => handleAssignedUsers(user.id)}
          />
        </div>
      ),
    };
  });

  const submitAssignOnboarding = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        // const userIds = userOnboardings.filter(user => user.)

        const { data: responseData } = await axios.post(
          `${url}/hr/user_onboarding`,
          { user_ids: assignedUsers, onboarding_id: props.id },
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
    getUserOnboardings();
  }, [getUserOnboardings]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
          p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full max-h-full my-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-green rounded-t-lg font-bold text-neutral-100">
          Assign Onboarding
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitAssignOnboarding(e)}
          className="w-full h-full p-2 flex flex-col items-start justify-center gap-4 overflow-hidden t:p-4"
        >
          <Table
            color="neutral"
            contents={mappedUserOnboardings}
            headers={["First Name", "Last Name", "Email", "Assign"]}
          />
          <button className="w-full p-2 rounded-md bg-accent-green text-neutral-100 font-bold mt-2">
            Assign
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignOnboarding;
