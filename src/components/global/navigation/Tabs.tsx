import Link from "next/link";
import React from "react";

const Tabs: React.FC<{
  tabs: string[];
  activeTab: string;
}> = (props) => {
  const mappedTabs = props.tabs.map((tab, index) => {
    return (
      <Link
        key={index}
        href={`?tab=${tab}`}
        className={`min-w-full t:min-w-fit t:w-full p-2 border-b-2 capitalize text-sm text-center ${
          props.activeTab === tab
            ? "text-accent-blue font-bold border-b-accent-blue"
            : ""
        }`}
      >
        {tab}
      </Link>
    );
  });

  return (
    <div className="w-full p-2 t:p-4">
      <div className="w-full flex flex-row items-center justify-start overflow-x-auto">
        {mappedTabs}
      </div>
    </div>
  );
};

export default Tabs;
