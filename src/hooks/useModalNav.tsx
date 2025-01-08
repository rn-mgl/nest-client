import React from "react";

export default function useModalNav(initialPage: string) {
  const [activeFormPage, setActiveFormPage] = React.useState(initialPage);

  const handleActiveFormPage = (page: string) => {
    setActiveFormPage(page);
  };

  return {
    activeFormPage,
    handleActiveFormPage,
  };
}
