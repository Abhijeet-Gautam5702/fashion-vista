import React from "react";
import { Logo } from "../components";

function Footer() {
  return (
    <div className=" mt-10 w-full flex flex-col justify-start items-center">
      {/* Content */}
      <div className="w-full flex flex-row justify-between items-start gap-3 px-32 pb-14">
        <div className=" w-1/2">
          <Logo className={"text-black text-size-30"} />
          <p className="font-main font-400 text-size-14 text-text-col-1">
            Fashion Vista is your one-stop destination for trendy and stylish
            apparel for men, women, and kids. We offer a curated selection of
            the latest fashion trends, combining comfort, quality, and
            affordability. Our goal is to make fashion accessible to everyone,
            while keeping sustainability in mind.
          </p>
        </div>
        <div className="">
          <p className="font-main font-500 text-size-20">COMPANY</p>
          <ul className="font-main font-400 text-size-14 text-text-col-1 space-y-1.5">
            <li>Home</li>
            <li>About</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="">
          <p className="font-main font-500 text-size-20">GET IN TOUCH</p>
          <ul className="font-main font-400 text-size-14 text-text-col-1 space-y-0.5">
            <li>Abhijeet Gautam</li>
            <li>abhidevelops572@gmail.com</li>
            <li>Noida, India</li>
          </ul>
        </div>
      </div>
      {/* Developer Info */}
      <p className="w-full p-2 text-center font-400 font-main text-size-14 bg-black text-white">
        Developed with love by{" "}
        <a
          href="https://github.com/Abhijeet-Gautam5702"
          target="_blank"
          className="text-size-12 text-accent-2 font-500 hover:underline"
        >
          {" "}
          ABHIJEET GAUTAM
        </a>
      </p>
    </div>
  );
}

export default Footer;
