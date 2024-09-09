import React from "react";
import { Icon } from "../components";

function FeatureCard({ icon, title, subtitle }) {
  return (
    <div className="w-[400px] flex flex-col justify-center items-center gap-1">
      <Icon icon={icon} size="60px" />
      <p className="font-main font-600 text-text-col-2 text-size-16">{title}</p>
      <p className="font-main font-400 text-text-col-1 text-size-16">
        {subtitle}
      </p>
    </div>
  );
}

export default FeatureCard;
