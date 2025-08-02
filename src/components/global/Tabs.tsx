import React from "react";

const Tabs: React.FC<{
  tabs: string[];
  activeTab: string;
  handleActiveTab: (tab: string) => void;
}> = (props) => {
  const mappedTabs = props.tabs.map((tab, index) => {
    return (
      <button
        key={index}
        onClick={() => props.handleActiveTab(tab)}
        className={`w-full p-2 border-b-2 capitalize text-sm ${
          props.activeTab === tab
            ? "text-accent-blue font-bold border-b-accent-blue"
            : ""
        }`}
      >
        {tab}
      </button>
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

export default Tabs;
