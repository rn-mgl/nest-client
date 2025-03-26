import { UserInterface } from "@/src/interface/UserInterface";
import React from "react";
import CheckBox from "../../form/CheckBox";

const Assignee: React.FC<{
  user: UserInterface;
  columns?: React.JSX.Element[];
  isChecked: boolean;
  handleAssignedEmployees: () => void;
}> = (props) => {
  const mappedColumns = props.columns?.map((column, index) => {
    return <React.Fragment key={index}>{column}</React.Fragment>;
  });

  const columnCount =
    typeof props.columns === "undefined" ? 4 : props.columns.length + 4;

  return (
    <div
      className={`w-full min-w-[768px] grid gap-4 p-4 border-b-[1px] items-center justify-start`}
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}
    >
      <div className="flex">
        <p className="truncate">{props.user.first_name}</p>
      </div>
      <div className="flex">
        <p className="truncate">{props.user.last_name}</p>
      </div>
      <div className="flex">
        <p className="truncate">{props.user.email}</p>
      </div>

      {mappedColumns}

      <div className="flex flex-col items-center justify-center">
        <CheckBox
          isChecked={props.isChecked}
          onClick={props.handleAssignedEmployees}
        />
      </div>
    </div>
  );
};

export default Assignee;
