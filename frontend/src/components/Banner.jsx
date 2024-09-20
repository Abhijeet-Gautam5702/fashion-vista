import React from "react";

function Banner({ image, className = "" }) {
  return (
    <div className={` w-full mt-3 border-[1px] border-text-col-2 h-fit py-10 md:h-[280px] lg:h-[350px] md:py-0 flex flex-row justify-between  `}>
      <div className={`${window.innerWidth >=600 ? "w-1/2" : "w-full px-1"} flex flex-col justify-center items-center text-text-col-2`}>
        <div>
          <p className=" w-full text-right text-size-16 font-main font-500">
            OUR BEST SELLERS
          </p>
          <p className=" w-full text-center md:text-[36px] lg:text-[45px] font-logo leading-none">
            Latest Arrivals
          </p>
          <p className=" w-full text-left text-size-16 font-main font-600">
            SHOP NOW
          </p>
        </div>
      </div>
      {window.innerWidth >= 600 && (
        <div className="w-1/2 bg-base">
          <img
            className="w-full h-full object-cover"
            src={image}
            alt="Banner"
          />
        </div>
      )}
    </div>
  );
}

export default Banner;
