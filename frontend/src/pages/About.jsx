import React, { useEffect } from "react";
import { Subscription } from "../components";
import { banner_2 } from "../assets";

function About() {
  // On Page load => Scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="border-y-[1.5px] border-y-gray py-10 w-full flex flex-col justify-start items-center gap-20">
      <p className="w-full text-center font-main text-text-col-2 text-size-24 font-500">
        ABOUT US
      </p>
      {/* Hero */}
      <div className="w-full flex flex-row justify-between items-center gap-16">
        {/* Image */}
        <div className="w-1/2 flex flex-row items-center justify-center flex-grow">
          <img
            className="w-full flex-grow text-center font-main text-black-1 font-400 text-size-12 py-auto"
            src={banner_2}
            alt="About Page Photo"
          />
        </div>
        {/* About Text */}
        <div className="w-1/2 flex flex-col justify-start items-start gap-6 font-main font-400 text-text-col-2 text-size-17">
          <p>
            Fashion Vista was born from a passion for innovation and a
            commitment to transforming the online shopping experience. Our
            journey began with a simple vision: to create a platform where
            customers can effortlessly discover, explore, and purchase a vast
            array of products from the comfort of their own homes.
          </p>
          <p>
            Since our launch, we have worked diligently to curate a wide-ranging
            collection of high-quality products that cater to diverse tastes and
            preferences. Whether it's fashion and beauty, electronics, or home
            essentials, we offer an extensive selection sourced from reputable
            brands and trusted suppliers.
          </p>
          <div className="mt-3 flex flex-col justify-start items-start gap-3">
            <p className="font-600 text-black text-size-17"> Our Mission</p>
            <p>
              At Fashion Vista, our mission is to empower customers by offering
              choice, convenience, and confidence. We are committed to
              delivering a seamless shopping experience that surpasses
              expectations, from browsing and ordering to delivery and customer
              care.
            </p>
          </div>
        </div>
      </div>
      {/* Why Choose Us */}
      <div className="w-full flex flex-col items-center justify-start gap-7 font-main">
        <p className="w-full text-left font-500 text-size-20 text-text-col-2">
          WHY DO WE STAND OUT?
        </p>
        <div className="w-full flex flex-row justify-between items-stretch">
          <div className="w-1/3 border-[1px] px-10 py-16 text-size-14 text-text-col-2 font-400 gap-3 border-gray flex flex-col items-center justify-center">
            <p className="font-500 text-black text-size-16">
              Quality Assurance
            </p>
            <p className="font-400">
              We meticulously select and vet each product to ensure it meets our
              stringent quality standards.
            </p>
          </div>
          <div className="w-1/3 border-[1px] px-10 py-16 text-size-14 text-text-col-2 font-400 gap-3 border-gray flex flex-col items-center justify-center">
            <p className="font-500 text-black text-size-16">Convenience</p>
            <p className="font-400">
              With our user-friendly interface and hassle-free ordering process,
              shopping has never been easier.
            </p>
          </div>
          <div className="w-1/3 border-[1px] px-10 py-16 text-size-14 text-text-col-2 font-400 gap-3 border-gray flex flex-col items-center justify-center">
            <p className="font-500 text-black text-size-16">Customer Service</p>
            <p className="font-400">
              Our team of dedicated professionals is here to assist you the way,
              ensuring your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </div>
      {/* Subscription */}
      <Subscription />
    </div>
  );
}

export default About;
