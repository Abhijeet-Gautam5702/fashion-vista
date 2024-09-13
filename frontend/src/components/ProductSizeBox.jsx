import React, { forwardRef } from "react";

function ProductSizeBox(
  { sizeText, className = "", type = "button", ...props },
  ref
) {
  return (
    <button
      type={type}
      className={`font-main font-400 p-2 transition-all duration-150 ${className}`}
      {...props}
    >
      {sizeText}
    </button>
  );
}

export default forwardRef(ProductSizeBox);
