import { ModalTabsInterface } from "@/src/interface/NavInterface";
import React from "react";

const ModalTabs: React.FC<ModalTabsInterface> = (props) => {
  const mappedTabs = props.tabs.map((page) => {
    return (
      <button
        key={page}
        className={`min-w-full t:w-full t:min-w-fit p-2 t:px-4 text-sm transition-all capitalize ${
          props.activeTab === page
            ? " text-accent-blue font-bold border-b-2 border-accent-blue"
            : "border-b-2"
        }`}
        onClick={() => props.handleActiveTab(page)}
        type="button"
      >
        {page}
      </button>
    );
  });

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex flex-row items-center justify-between overflow-x-auto overflow-y-hidden">
        {mappedTabs}
      </div>
    </div>
  );
};

export default ModalTabs;
