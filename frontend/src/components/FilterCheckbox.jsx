import React, { useId } from "react";

function FilterCheckbox({ label, ...props }) {
  const id = useId();
  return (
    <div className="flex flex-row justify-start items-center gap-3">
      <input type="checkbox" id={id} {...props} />
      <label className="text-size-12 sm:text-size-14 font-main font-300" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export default FilterCheckbox;
