import React from "react";

function Icon({ size = "25px", icon }) {
  return (
    <div className="bg-white w-full flex flex-row items-center justify-center">
      <img width={size} height={size} src={icon} alt="Icon" />
    </div>
  );
}

export default Icon;
