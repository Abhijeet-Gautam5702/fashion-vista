import React, { useId } from "react";

function Input(
  { type = "text", label = "", placeholder = "", className = "", ...props },
  ref
) {
  const inputId = useId();
  return (
    <div className="w-full">
      <label htmlFor={inputId}>{label}</label>
      <input
        type={type}
        className={`${className} p-3 outline-none border-[1px] border-black-2 w-[400px] font-main font-400 text-size-16 text-text-col-2  placeholder:text-text-col-1/70 `}
        ref={ref}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}

export default Input;
