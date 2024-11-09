import React from "react";
import {
  Filter as FilterInterface,
  Category as CategoryInterface,
} from "@/interface/FilterInterface";

const Category: React.FC<CategoryInterface & FilterInterface> = (props) => {
  const mappedCategories = props.categoryKeyValuePairs.map((category) => {
    return category.labelValue.map((label, index) => {
      return (
        <button
          onClick={() =>
            props.selectCategory(category.key, label.value, label.label)
          }
          key={index}
          className="p-2 w-full hover:brightness-90 transition-all bg-neutral-200 rounded-sm"
        >
          {label.label}
        </button>
      );
    });
  });

  return (
    <div
      className={`${
        props.showFilters ? "flex" : "hidden t:flex"
      } w-full t:max-w-40 t:min-w-40 relative `}
    >
      <button
        onClick={props.toggleShowCategories}
        className="p-2 rounded-md border-2 w-full"
      >
        {props.categoryLabel}
      </button>

      {props.canShowCategories ? (
        <div
          className="w-full absolute top-0 left-0 flex flex-col items-center justify-start translate-y-14 z-20
                rounded-md gap-2 p-2 bg-neutral-100 animate-fade shadow-md"
        >
          {mappedCategories}
        </div>
      ) : null}
    </div>
  );
};

export default Category;
