import { LeaveBalanceInterface } from "@/src/interface/LeaveInterface";
import { ModalInterface } from "@/src/interface/ModalInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import CheckBox from "../../form/CheckBox";

const AssignLeave: React.FC<ModalInterface> = (props) => {
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
        const left = prev.slice(0, prev.indexOf(id));
        const right = prev.slice(prev.indexOf(id) + 1, prev.length);

        return [...left, ...right];
      } else {
        return [...prev, id];
      }
    });
  };

  const getEmployeeLeaves = React.useCallback(async () => {
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.get<{
          users: (UserInterface & LeaveBalanceInterface)[];
        }>(`${url}/hr/leave_balance`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
          },
          withCredentials: true,
          params: { leave_type_id: props.id },
        });

        if (responseData.users) {
          setEmployeeLeaves(responseData.users);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user?.token, url, props.id]);

  const mappedEmployees = employeeLeaves.map((employee, id) => {
    const isAssigned = assignedEmployees.includes(employee.user_id);

    return (
      <div
        key={id}
        className="w-full min-w-[768px] p-4 gap-4 grid grid-cols-5 border-b-[1px] *:flex *:flex-row *:items-center"
      >
        <div className="justify-start">
          <p className="truncate">{employee.first_name}</p>
        </div>
        <div className="justify-start">
          <p className="truncate">{employee.last_name}</p>
        </div>
        <div className="justify-start">
          <p className="truncate">{employee.email}</p>
        </div>
        <div className="text-center justify-center">
          <p>{employee.balance ?? 0}</p>
        </div>
        <div className="justify-center">
          <CheckBox
            onChange={handleAssignedEmployees}
            isChecked={isAssigned}
            value={employee.user_id}
          />
        </div>
      </div>
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
        <div className="w-full flex flex-col items-center justify-start p-4">
          <div className="w-full h-full flex flex-col items-start justify-center border-[1px] rounded-md overflow-x-auto">
            <div className="grid min-w-[768px] grid-cols-5 w-full gap-4 p-4 items-center justify-start bg-neutral-200 ">
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
        </div>
      </div>
    </div>
  );
};

export default AssignLeave;
