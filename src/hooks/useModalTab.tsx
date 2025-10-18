import React from "react";

export default function useModalTab(initialPage: string) {
  const [activeTab, setActiveFormPage] = React.useState(initialPage);

  const handleActiveTab = (page: string) => {
    setActiveFormPage(page);
  };

  return {
    activeTab,
    handleActiveTab,
  };
}
