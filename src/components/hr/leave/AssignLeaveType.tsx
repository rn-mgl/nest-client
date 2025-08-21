import { LeaveBalanceInterface } from "@/src/interface/LeaveInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";

import { useSession } from "next-auth/react";
import React from "react";
import { IoAdd, IoClose, IoRemove } from "react-icons/io5";
import Assignee from "@/hr/global/Assignee";

const AssignLeaveType: React.FC<ModalInterface> = (props) => {
  const [employeeLeaves, setEmployeeLeaves] = React.useState<
    (UserInterface & LeaveBalanceInterface)[]
  >([]);
  const [assignedEmployees, setAssignedEmployees] = React.useState<number[]>(
    []
  );

  const { data } = useSession({ required: true });
  const user = data?.user;
  const url = process.env.URL;

  const handleAssignedEmployees = (id: number) => {
    setAssignedEmployees((prev) => {
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

    setEmployeeLeaves((prev) => {
      const balance = [...prev];
      balance[index] = {
        ...prev[index],
        balance: value === "" ? "" : Number(value),
      };

      return [...balance];
    });
  };

  const handleAddLeaveBalance = (index: number) => {
    setEmployeeLeaves((prev) => {
      const leaves = [...prev];
      const balance =
        leaves[index].balance !== null ? leaves[index].balance : 0;

      leaves[index] = {
        ...leaves[index],
        balance: (balance as number) + 1,
      };

      return leaves;
    });
  };

  const handleSubtractLeaveBalance = (index: number) => {
    setEmployeeLeaves((prev) => {
      const leaves = [...prev];
      const balance =
        leaves[index].balance !== null ? leaves[index].balance : 0;

      leaves[index] = {
        ...leaves[index],
        balance: (balance as number) - 1 > 0 ? (balance as number) - 1 : 0,
      };

      return leaves;
    });
  };

  const getEmployeeLeaves = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          users: (UserInterface & LeaveBalanceInterface)[];
        }>(`${url}/hr/employee_leave_balance`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials: true,
          params: { leave_type_id: props.id },
        });

        if (responseData.users) {
          setEmployeeLeaves(responseData.users);
          setAssignedEmployees(
            responseData.users
              .filter((employee) => employee.leave_balance_id !== null)
              .map((employee) => employee.user_id)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, url, props.id]);

  const submitAssignLeaveType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/hr/employee_leave_balance`,
          {
            employee_leaves: employeeLeaves.map((leave) => ({
              ...leave,
              balance: leave.balance ?? 0,
            })),
            user_ids: assignedEmployees,
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

        console.log(responseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mappedEmployees = employeeLeaves.map((employee, index) => {
    const isChecked = assignedEmployees.includes(employee.user_id);

    return (
      <Assignee
        key={index}
        user={employee}
        handleAssignedEmployees={() =>
          handleAssignedEmployees(employee.user_id)
        }
        isChecked={isChecked}
        columns={[
          <div
            key={`leaveBalance${index}`}
            className="text-center justify-center flex flex-row items-center gap-4"
          >
            <button
              type="button"
              onClick={() => handleSubtractLeaveBalance(index)}
              className="p-1 rounded-sm bg-red-600 text-neutral-100"
            >
              <IoRemove />
            </button>
            <input
              type="number"
              value={employee.balance ?? 0}
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
          </div>,
        ]}
      />
    );
  });

  React.useEffect(() => {
    getEmployeeLeaves();
  }, [getEmployeeLeaves]);

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
          onSubmit={(e) => submitAssignLeaveType(e)}
          className="w-full flex flex-col items-center justify-start p-2 gap-4 t:p-4"
        >
          <div className="w-full h-full flex flex-col items-start justify-center border-[1px] rounded-md overflow-x-auto">
            <div className="grid min-w-[768px] grid-cols-5 w-full gap-4 p-4 items-center justify-start bg-neutral-200 font-bold">
              <p>First Name</p>
              <p>Last Name</p>
              <p>Email</p>
              <p className="text-center">Balance</p>
              <p className="text-center">Assign</p>
            </div>

            <div className="w-full min-w-[768px] flex flex-col items-start justify-center overflow-y-auto overflow-x-hidden">
              {mappedEmployees}
            </div>
          </div>

          <button className="w-full p-2 rounded-md bg-accent-green text-neutral-100 mt-2 font-bold">
            Assign
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignLeaveType;
