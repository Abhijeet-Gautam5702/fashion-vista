import React from "react";
import { FeatureCard } from "../components";
import { customer_service, check_badge, exchange } from "../assets";

function Policy() {
  return (
    <div className="w-full flex flex-col gap-6 md:gap-0 md:flex-row justify-evenly items-center">
      <FeatureCard
        icon={check_badge}
        title={"7 Day Return Policy"}
        subtitle={"We provide 7 days free return policy"}
      />
      <FeatureCard
        icon={exchange}
        title={"Easy Exchange Policy"}
        subtitle={"We offer hassle free exchange policy"}
      />
      <FeatureCard
        icon={customer_service}
        title={"Best Customer Support"}
        subtitle={"we provide 24/7 customer support"}
      />
    </div>
  );
}

export default Policy;
