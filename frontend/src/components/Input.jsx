import React, { forwardRef, useId } from "react";

function Input(
  { type = "text", label = "", placeholder = "", className = "", ...props },
  ref
) {
  const inputId = useId();
  return (
    <div className="w-full flex flex-row justify-start items-center gap-3">
      <input
        id={inputId}
        type={type}
        className={`${className} p-2 sm:p-3 outline-none border-[1px] border-black-2 w-full font-main font-400 text-size-14 sm:text-size-16 text-text-col-2 placeholder:text-text-col-1/70 `}
        ref={ref}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}

export default forwardRef(Input);
