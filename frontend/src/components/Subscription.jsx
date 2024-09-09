import React, { forwardRef, useEffect, useState } from "react";
import { Button } from "../components";

function Subscription({ ...props }, ref) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail("");
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 mb-20">
      <p className="w-full text-center font-main font-500 text-size-24">
        Subscribe now & get discounts
      </p>
      <p className="w-full text-center font-main font-400 text-size-16 text-text-col-1">
        Subscribe to our newsletter & get early deal notifications along with
        23% off on the latest arrivals
      </p>
      <div className="mt-5 flex flex-row justify-center items-stretch">
        <label htmlFor="subscription"></label>
        <input
          className="p-3 outline-none border-[1px] border-black-2 w-[400px] font-main font-400 text-size-16 text-text-col-2  placeholder:text-text-col-1/70 "
          type="text"
          placeholder="Enter your email"
          ref={ref}
          value={email}
          {...props}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Button
          btnText="SUBSCRIBE"
          className="w-[150px] text-size-12 border-[2px] border-black"
        />
      </div>
    </div>
  );
}

export default forwardRef(Subscription);
