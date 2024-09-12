import React, { forwardRef } from "react";

function ProductSizeBox(
  { sizeText, className = "", type = "button", ...props },
  ref
) {
  return (
    <button
      type={type}
      className={`${className} font-main font-400 text-size-16 p-2 transition-all duration-150`}
      {...props}
    >
      {sizeText}
    </button>
  );
}

export default forwardRef(ProductSizeBox);
