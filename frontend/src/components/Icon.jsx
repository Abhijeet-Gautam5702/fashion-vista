import React from "react";

function Icon({ size = "25px", icon, className }) {
  return (
    <div
      className={` bg-white flex flex-row items-center justify-center ${className}`}
    >
      <img width={size} height={size} src={icon} alt="Icon" />
    </div>
  );
}

export default Icon;
