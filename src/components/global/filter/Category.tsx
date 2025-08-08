import { CategoryInterface } from "@/interface/FilterInterface";
import React from "react";

const Category: React.FC<CategoryInterface> = (props) => {
  const formattedCategoryValue = props.categoryValue.replaceAll("_", " ");

  return (
    <div className="flex min-w-72 t:w-44 t:max-w-44 t:min-w-44 relative">
      <button
        onClick={props.toggleCanSeeCategoryDropDown}
        className="p-2 rounded-md border-2 w-full truncate capitalize"
      >
        {formattedCategoryValue}
      </button>
    </div>
  );
};

export default Category;
