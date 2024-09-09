import React from "react";

function Button({
  type = "button",
  btnText = "SUBMIT",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`${className}  bg-black text-white font-main font-400`}
      {...props}
    >
      {btnText}
    </button>
  );
}

export default Button;
