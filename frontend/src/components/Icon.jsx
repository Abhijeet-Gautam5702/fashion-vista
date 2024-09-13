import React from "react";

function Icon({ size = "25px", icon, className, ...props }) {
  return (
    <div
      className={` bg-white flex flex-row items-center justify-center ${className}`}
      {...props}
    >
      <img width={size} height={size} src={icon} alt="Icon" />
    </div>
  );
}

export default Icon;
