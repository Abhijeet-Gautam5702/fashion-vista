import React, { forwardRef, useId, useState } from "react";
import { Icon, ProductSizeBox } from "../components";
import { trash_2 } from "../assets";

function CartItem({ cartItem, deleteItemHandler, ...props }, ref) {
  const id = useId();

  return (
    <div className="relative w-full border-y-[1px] border-y-gray border- py-5 flex flex-row item-start  justify-start sm:justify-between gap-2 sm:gap-5">
      {/* Image */}
      <div className="w-1/4 sm:w-[80px]">
        <img
          className="w-full h-auto object-cover"
          src={cartItem.product.images[0]}
          alt="product image"
        />
      </div>
      {/* Product name, price & size */}
      <div className="w-1/2 sm:w-[400px] h-full flex flex-col items-start justify-start gap-1 sm:gap-5">
        <p className="font-main font-500 text-text-col-2 text-size-14 sm:text-size-20">
          {cartItem.product.name}
        </p>
        <div className="flex flex-row items-center justify-start gap-5">
          <p className="font-main text-size-14 sm:text-size-16 font-400 text-text-col-2">
            $ {cartItem.product.price}
          </p>
          <ProductSizeBox
            sizeText={cartItem.size}
            className={`w-fit sm:min-w-[40px] bg-white border-[1px] border-black-1 py-1`}
            disabled={true}
          />
        </div>
      </div>
      {/* Product Quantity */}
      <input
        id={id}
        type="number"
        className="absolute top-5 right-2 sm:relative sm:right-0 sm-top-0 font-main h-fit w-[40px] sm:w-[80px] font-400 text-text-col-2 text-size-14 sm:text-size-16 border-[1px] border-black-1 outline-none p-2 mx-auto"
        min={1}
        max={15}
        step={1}
        ref={ref}
        {...props}
      />
      {/* Delete Item Icon */}
      <Icon
        icon={trash_2}
        size={window.innerWidth > 450 ? "23px" : "18px"}
        className={` cursor-pointer absolute bottom-2 right-2 sm:relative sm:right-0 sm-bottom-0 `}
        onClick={deleteItemHandler}
      />
    </div>
  );
}

export default forwardRef(CartItem);
