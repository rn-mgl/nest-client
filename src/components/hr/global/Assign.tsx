import { UserInterface } from "@/src/interface/UserInterface";
import React from "react";

const Assign: React.FC<{
  user: UserInterface;
  columns: React.JSX.Element[];
}> = (props) => {
  const mappedColumns = props.columns.map((column, index) => {
    return <React.Fragment key={index}>{column}</React.Fragment>;
  });

  return (
    <div
      className={`w-full min-w-[768px] grid gap-4 p-4 border-b-[1px] items-center justify-start`}
      style={{
        gridTemplateColumns: `repeat(${
          props.columns.length + 3
        }, minmax(0, 1fr))`,
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
    </div>
  );
};

export default Assign;
