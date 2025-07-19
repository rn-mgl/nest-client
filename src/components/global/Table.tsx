import { TableInterface } from "@/src/interface/TableInterface";
import React from "react";

const Table: React.FC<TableInterface> = (props) => {
  const HEADER_COLOR_MAP = {
    blue: { background: "#0039c7", color: "#f5f5f5" },
    purple: { background: "#524ee5", color: "#f5f5f5" },
    green: { background: "#6abaa3", color: "#f5f5f5" },
    yellow: { background: "#c2ff9c", color: "#171717" },
    neutral: { background: "#e5e5e5", color: "#171717" },
  };

  const mappedHeaders = props.headers.map((header, index) => {
    return (
      <div
        key={index}
        className="w-full textne items-center justify-start truncate"
      >
        {header}
      </div>
    );
  });

  const mappedRows = props.contents.map((content, index) => {
    const columns = Object.keys(content);
    const mappedContents = columns.map((key, index) => {
      return (
        <div key={index} className="truncate w-full">
          {content[key as keyof object]}
        </div>
      );
    });

    return (
      <div
        key={index}
        style={{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }}
        className="w-full items-center justify-start truncate grid border gap-4 p-4 last:rounded-b-md hover:[&_div]:text-wrap 
                hover:bg-neutral-50 transition-all hover:[&>div]:overflow-auto hover:[&>div]:whitespace-normal"
      >
        {mappedContents}
      </div>
    );
  });

  return (
    <div className="w-full flex flex-col items-start justify-center overflow-x-auto">
      <div
        style={{
          gridTemplateColumns: `repeat(${props.headers.length}, minmax(0, 1fr))`,
          background:
            HEADER_COLOR_MAP[props.color as keyof object]["background"],
          color: HEADER_COLOR_MAP[props.color as keyof object]["color"],
        }}
        className="w-full min-w-(--breakpoint-t) grid rounded-t-md font-bold l-s:min-w-full border gap-4 p-4"
      >
        {mappedHeaders}
      </div>

      <div className="w-full min-w-(--breakpoint-t) grid l-s:min-w-full">
        {mappedRows}
      </div>
    </div>
  );
};

export default Table;
