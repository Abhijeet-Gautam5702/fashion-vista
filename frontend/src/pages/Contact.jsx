import React, { useEffect } from "react";
import { banner_2 ,contact} from "../assets";
import { Button } from "../components";

function Contact() {
  // On Page load => Scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="border-y-[1.5px] border-y-gray pt-8 pb-16 w-full flex flex-col justify-start items-center gap-12">
      <p className="w-full text-center font-main text-text-col-2 text-size-24 font-500">
        CONTACT US
      </p>
      <div className="w-full flex flex-row items-center justify-between font-main px-10 gap-10">
        {/* Image */}
        <div className="w-1/2 flex flex-row items-center justify-center flex-grow">
          <img
            className="w-full flex-grow text-center font-main text-black-1 font-400 text-size-12 py-auto"
            src={contact}
            alt="Contact Page Photo"
          />
        </div>
        {/* Contact details */}
        <div className="w-1/2 flex flex-col justify-center items-start gap-8 leading-normal text-text-col-1 font-500 text-size-16">
          <div className="flex flex-col justify-start items-start gap-1 text-size-16 text-text-col-1 font-500">
            <p className="font-600 text-text-col-2 text-size-20 mb-1">
              {" "}
              Shop from us offline at
            </p>
            <p>St. Petersburg Street</p>
            <p>Washington DC, USA</p>
          </div>

          <div className="flex flex-col justify-start items-start gap-1 text-size-16 text-text-col-1 font-500">
            <p className="text-size-17">Email: abhidevelops572@gmail.com</p>
            <p className="text-size-17">Phone: +91 4561238922</p>
          </div>

          <div className="flex flex-col justify-start items-start gap-1 text-size-16 text-text-col-1 font-500">
            <p className="font-600 text-text-col-2 text-size-20 mb-1">
              {" "}
              Careers at{" "}
              <span className="font-logo leading-none">Fashion Vista</span>
            </p>
            <p>St. Petersburg Street</p>
            <p>Washington DC, USA</p>
            <button className="mt-6 bg-white text-black hover:bg-black hover:text-white px-8 py-4 border-[1.5px] border-black transition-colors duration-150">
              Explore careers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
