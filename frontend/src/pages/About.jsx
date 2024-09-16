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
    <div className="py-10 w-full flex flex-col justify-start items-center gap-20">
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
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>
          <p>
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>
          <div className="mt-3 flex flex-col justify-start items-start gap-3">
            <p className="font-600 text-black text-size-17"> Our Mission</p>
            <p>
              Our mission at Forever is to empower customers with choice,
              convenience, and confidence. We're dedicated to providing a
              seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
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
