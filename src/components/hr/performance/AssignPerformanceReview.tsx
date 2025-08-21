import { ModalInterface } from "@/src/interface/ModalInterface";
import { EmployeePerformanceReviewInterface } from "@/src/interface/PerformanceReviewInterface";
import { UserInterface } from "@/src/interface/UserInterface";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { IoClose } from "react-icons/io5";
import Assignee from "@/hr/global/Assignee";

const AssignPerformanceReview: React.FC<ModalInterface> = (props) => {
  const [employeePerformanceReviews, setEmployeePerformanceReviews] =
    React.useState<(EmployeePerformanceReviewInterface & UserInterface)[]>([]);
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

  const getEmployeePerformanceReviews = React.useCallback(async () => {
    try {
      if (user?.token) {
        const { data: responseData } = await axios.get<{
          employees: (EmployeePerformanceReviewInterface & UserInterface)[];
        }>(`${url}/hr/employee_performance_review`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          withCredentials: true,
          params: { performance_review_id: props.id },
        });

        if (responseData.employees) {
          setEmployeePerformanceReviews(responseData.employees);
          setAssignedEmployees(
            responseData.employees
              .filter(
                (employee) => employee.employee_performance_review_id !== null
              )
              .map((employee) => employee.user_id)
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, user?.token, props.id]);

  const submitAssignPerformanceReview = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const { token } = await getCSRFToken();

      if (token && user?.token) {
        const { data: responseData } = await axios.post(
          `${url}/hr/employee_performance_review`,
          { user_ids: assignedEmployees, performance_review_id: props.id },
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

  const mappedEmployeePerformanceReviews = employeePerformanceReviews.map(
    (employee, index) => {
      const isChecked = assignedEmployees.includes(employee.user_id);
      return (
        <Assignee
          key={index}
          user={employee}
          handleAssignedEmployees={() =>
            handleAssignedEmployees(employee.user_id)
          }
          isChecked={isChecked}
        />
      );
    }
  );

  React.useEffect(() => {
    getEmployeePerformanceReviews();
  }, [getEmployeePerformanceReviews]);

  return (
    <div
      className="w-full h-full backdrop-blur-md fixed top-0 left-0 flex flex-col items-center justify-start 
            p-4 t:p-8 z-50 bg-linear-to-b from-accent-blue/30 to-accent-yellow/30 animate-fade overflow-y-auto l-s:overflow-hidden"
    >
      <div className="w-full max-h-full my-auto max-w-(--breakpoint-l-s) bg-neutral-100 shadow-md rounded-lg flex flex-col items-center justify-start">
        <div className="w-full flex flex-row items-center justify-between p-4 bg-accent-green rounded-t-lg font-bold text-neutral-100">
          Assign Performance Review
          <button
            onClick={props.toggleModal}
            className="p-2 rounded-full hover:bg-accent-blue/20 transition-all text-xl"
          >
            <IoClose />
          </button>
        </div>
        <form
          onSubmit={(e) => submitAssignPerformanceReview(e)}
          className="w-full h-full p-2 flex flex-col items-start justify-center gap-4 overflow-hidden t:p-4"
        >
          <div className="w-full h-full flex flex-col items-start justify-start border-[1px] rounded-md overflow-x-auto">
            <div className="grid grid-cols-4 p-4 items-center font-bold gap-4 justify-start min-w-[768px] w-full bg-neutral-200">
              <p>First Name</p>
              <p>Last Name</p>
              <p>Email</p>
              <p className="text-center">Assign</p>
            </div>

            <div className="w-full min-w-[768px] max-h-full flex flex-col items-start justify-start overflow-y-auto overflow-x-hidden">
              {mappedEmployeePerformanceReviews}
            </div>
          </div>

          <button className="w-full p-2 rounded-md bg-accent-green text-neutral-100 font-bold mt-2">
            Assign
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignPerformanceReview;
