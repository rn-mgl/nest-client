import { ModalNavInterface } from "@/src/interface/FormInterface";
import React from "react";

const ModalNav: React.FC<ModalNavInterface> = (props) => {
  const mappedNavs = props.pages.map((page, index) => {
    return (
      <button
        key={index}
        className={`w-full p-2 t:px-4 rounded-md text-sm transition-all hover:bg-neutral-300 capitalize ${
          props.activeFormPage === page
            ? " text-neutral-900 font-bold bg-white"
            : null
        }`}
        onClick={() => props.handleActiveFormPage(page)}
        type="button"
      >
        {page}
      </button>
    );
  });

  return (
    <div className="w-full flex flex-col items-center justify-center t:w-fit">
      <div className="w-full t:w-fit flex flex-row items-center justify-between gap-2 bg-neutral-200 rounded-md p-2 overflow-x-auto overflow-y-hidden">
        {mappedNavs}
      </div>
    </div>
  );
};

export default ModalNav;
