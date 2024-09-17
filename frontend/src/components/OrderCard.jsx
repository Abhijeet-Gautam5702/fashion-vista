import React from "react";
import { Icon, OrderedProductCard } from "../components";
import { box } from "../assets";

function OrderCard({ order }) {
  // Convert the ISO date to the standard format
  const isoDate = new Date(order.orderDate);
  const orderDate = isoDate.toLocaleDateString("en-GB");
  const orderTime = isoDate.toLocaleTimeString("en-US", { hour12: false });

  return (
    <div className="w-full py-5 border-y-[1px] border-y-black-1 flex flex-row justify-between gap-7">
      {/* Primary Details */}
      <div className="w-1/3 flex flex-col justify-start items-start gap-4">
        {/* Order-ID and Icon */}
        <div className="w-full flex flex-row justify-start items-center gap-3">
          <Icon className={""} size="70px" icon={box} />
          <div className="w-full flex flex-col justify-between items-center">
            <p className="w-full font-main font-500 text-black text-size-14">
              Order Code
            </p>
            <p className="w-full font-main font-500 text-text-col-2 text-size-14">
              {order._id}
            </p>
            <p className=" mt-1 w-full font-main font-400 text-text-col-1 text-size-14">
              {`${orderDate} at ${orderTime}`}
            </p>
          </div>
        </div>
        {/* Delivery Address */}
        <div className="w-5/6 flex flex-col justify-start items-start">
          <p className="font-main font-400 text-size-14 text-text-col-2">
            {order.deliveryAddress}
          </p>
        </div>
      </div>
      {/* Product List */}
      <div className="w-1/3 flex flex-col justify-start items-center">
        {order.orderedItems.map((item) => (
          <OrderedProductCard key={Math.random()} orderItem={item} />
        ))}
      </div>
      {/* Order status */}
      <div className=" flex-grow flex flex-col justify-start items-end font-main font-400 text-text-col-2 text-size-16 gap-3">
        <p className="text-size-20 text-black font-500">{`$ ${order.orderValue}`}</p>
        <p className="text-size-14">{`Payment status: ${
          order.paymentStatus ? "Paid" : "Pending"
        }`}</p>
        <p className="text-size-14">
          {order.paymentMode ? "Cash On Delivery" : `${order.paymentMode}`}
        </p>
        <p className={`py-2 px-6 text-size-14  w-fit border-[1.5px] ${order.status === "delivered" ? " border-positive-accent bg-postive/60 text-positive-dark font-500 " : " border-text-col-1 bg-white text-text-col-2 "}`}>
          {order.status.toString().toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default OrderCard;
