import { ModalNavInterface } from "@/src/interface/FormInterface";
import React from "react";

const ModalNav: React.FC<ModalNavInterface> = (props) => {
  const mappedNavs = props.pages.map((page, index) => {
    return (
      <button
        key={index}
        className={`w-full p-2 t:px-4 text-sm transition-all capitalize ${
          props.activeFormPage === page
            ? " text-accent-blue font-bold border-b-2 border-accent-blue"
            : "border-b-2"
        }`}
        onClick={() => props.handleActiveFormPage(page)}
        type="button"
      >
        {page}
      </button>
    );
  });

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex flex-row items-center justify-between overflow-x-auto overflow-y-hidden">
        {mappedNavs}
      </div>
    </div>
  );
};

export default ModalNav;
