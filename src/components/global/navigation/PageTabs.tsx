import { PageTabsInterface } from "@/src/interface/NavInterface";
import Link from "next/link";
import React from "react";

const PageTabs: React.FC<PageTabsInterface> = (props) => {
  const mappedTabs = props.tabs.map((tab) => {
    return (
      <Link
        key={tab}
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
    <div className="w-full">
      <div className="w-full flex flex-row items-center justify-start overflow-x-auto">
        {mappedTabs}
      </div>
    </div>
  );
};

export default PageTabs;
