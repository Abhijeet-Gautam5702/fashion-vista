import React from "react";
import { ProductSizeBox } from "../components";

function OrderedProductCard({ orderItem }) {
  return (
    <div className="w-full border-y-[1px] border-y-gray flex flex-row justify-start gap-3 py-2">
      {/* Image */}
      <div className="w-[80px] sm:w-[50px]">
        <img
          className="w-full h-auto object-cover"
          src={orderItem.product.images[0]}
          alt="product image"
        />
      </div>
      {/* Product name, size & quantity */}
      <div className="w-fit flex-grow flex flex-col items-start justify-between">
        <p className="font-main font-500 text-text-col-2 sm:text-size-14">
          {orderItem.product.name}
        </p>
        <div className="flex flex-row items-center justify-start">
          <ProductSizeBox
            sizeText={orderItem.size}
            className={`w-[30px] text-size-14 sm:text-size-12 bg-white border-[1px] border-black-1 p-2 sm:p-1`}
            disabled={true}
          />
          <ProductSizeBox
            sizeText={"x"}
            className={`w-[30px] text-size-14 sm:text-size-12 p-1`}
            disabled={true}
          />
          <ProductSizeBox
            sizeText={orderItem.quantity}
            className={` text-size-14 sm:text-size-12 p-2 sm:p-1`}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderedProductCard;
