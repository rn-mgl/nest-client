import { AssignedLeaveBalance } from "@/src/interface/LeaveInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios, { isAxiosError } from "axios";

import CheckBox from "@/src/components/global/form/CheckBox";
import Table from "@/global/field/Table";
import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoClose, IoRemove } from "react-icons/io5";
import { isCloudFileSummary } from "@/src/utils/utils";
import { useToasts } from "@/src/context/ToastContext";
import useIsLoading from "@/src/hooks/useIsLoading";
import LogoLoader from "../global/loader/LogoLoader";

const AssignLeaveType: React.FC<ModalInterface> = (props) => {
  const [userLeaves, setUserLeaves] = React.useState<AssignedLeaveBalance[]>(
    []
  );
  const [assignedUsers, setAssignedUsers] = React.useState<number[]>([]);
  const { addToast } = useToasts();

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const { isLoading, handleIsLoading } = useIsLoading();

  // if the user does not have a leave balance yet, make a false data
  // only the balance is necessary
  const FALSE_LEAVE_BALANCE_DATA = {
    leave_type_id: props.id as number,
    balance: 0,
    assigned_to: 0,
    provided_by: user?.current as number,
    created_at: "",
    leave: {
      created_by: 0,
      description: "",
      type: "",
    },
    deleted_at: null,
  };

  const handleAssignedEmployees = (id: number) => {
    setAssignedUsers((prev) => {
      if (prev.includes(id)) {
        const removedId = prev.filter((assigned) => assigned !== id);
        return removedId;
      } else {
        return [...prev, id];
      }
    });
  };

  const handleEmployeeLeaveBalance = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;

    setUserLeaves((prev) => {
      const leaves = [...prev];

      leaves[index] = {
        ...leaves[index],
        assigned_leave_balance: {
          ...(leaves[index].assigned_leave_balance ?? FALSE_LEAVE_BALANCE_DATA),
          balance: value,
        },
      };
      return leaves;
    });
  };

  const handleAddLeaveBalance = (index: number) => {
    setUserLeaves((prev) => {
      const leaves = [...prev];

      leaves[index] = {
        ...leaves[index],
        assigned_leave_balance: {
          ...(leaves[index].assigned_leave_balance ?? FALSE_LEAVE_BALANCE_DATA),
          balance:
            Number(leaves[index].assigned_leave_balance?.balance ?? 0) + 1,
        },
      };

      return leaves;
    });
  };

  const handleSubtractLeaveBalance = (index: number) => {
    setUserLeaves((prev) => {
      const leaves = [...prev];
      leaves[index] = {
        ...leaves[index],
        assigned_leave_balance: {
          ...(leaves[index].assigned_leave_balance ?? FALSE_LEAVE_BALANCE_DATA),
          balance:
            Number(leaves[index].assigned_leave_balance?.balance ?? 0) - 1 < 0
              ? 0
              : Number(leaves[index].assigned_leave_balance?.balance ?? 0) - 1,
        },
      };

      return leaves;
    });
  };

  const getEmployeeLeaves = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          users: AssignedLeaveBalance[];
        }>(`${url}/leave-type/assignment`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials: true,
          params: { leave_type_id: props.id },
        });

        if (responseData.users) {
          setUserLeaves(responseData.users);
          setAssignedUsers(
            responseData.users
              .filter(
                (user) =>
                  user.assigned_leave_balance !== null &&
                  user.assigned_leave_balance.deleted_at === null
              )
              .map((user) => user.id)
          );
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the employee leaves are being retrieved.";
        addToast("Employee Leaves", message, "error");
      }
    }
  }, [user?.token, url, props.id, addToast]);

  const submitAssignLeaveType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      handleIsLoading(true);
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/leave-type/assignment`,
          {
            user_leaves: userLeaves,
            user_ids: assignedUsers,
            leave_type_id: props.id,
          },
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
            "Leave Assigned",
            `Leave has been successfully assigned.`,
            "success"
          );
          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);

      if (isAxiosError(error)) {
        const message =
          error.response?.data.message ??
          error.message ??
          "An error occurred when the user leaves are being assigned.";
        addToast("Employee Leaves", message, "error");
      }
    } finally {
      handleIsLoading(false);
    }
  };

  const mappedEmployees = userLeaves.map((user, index) => {
    const userImage = isCloudFileSummary(user.image) ? user.image.url : "";

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
      balance: (
        <div className="text-center justify-starts flex flex-row items-center gap-4">
          <button
            type="button"
            onClick={() => handleSubtractLeaveBalance(index)}
            className="p-1 rounded-sm bg-red-600 text-neutral-100"
          >
            <IoRemove />
          </button>
          <input
            type="number"
            value={user.assigned_leave_balance?.balance ?? 0}
            min={0}
            onChange={(e) => handleEmployeeLeaveBalance(e, index)}
            className="bg-neutral-200 rounded-sm w-10 text-center p-0.5 border-0 outline-0"
          />
          <button
            type="button"
            onClick={() => handleAddLeaveBalance(index)}
            className="p-1 rounded-sm bg-accent-green text-neutral-100"
          >
            <IoAdd />
          </button>
        </div>
      ),
      assign: (
        <div className="flex flex-col items-start justify-center">
          <CheckBox
            isChecked={isChecked}
            onClick={() => handleAssignedEmployees(user.id)}
          />
        </div>
      ),
    };
  });

  React.useEffect(() => {
    getEmployeeLeaves();
  }, [getEmployeeLeaves]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
            p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      {isLoading ? <LogoLoader /> : null}
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
          onSubmit={(e) => submitAssignLeaveType(e)}
          className="w-full flex flex-col items-center justify-start p-2 gap-4 t:p-4 overflow-hidden"
        >
          <Table
            color="neutral"
            contents={mappedEmployees}
            headers={[
              "Image",
              "First Name",
              "Last Name",
              "Email",
              "Balance",
              "Assign",
            ]}
          />

          <button
            disabled={true}
            className="w-full p-2 rounded-md bg-accent-green text-neutral-100 mt-2 font-bold"
          >
            Assign
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignLeaveType;
