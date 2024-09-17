import React from "react";
import { Icon, OrderedProductCard } from "../components";
import { box } from "../assets";

function AdminOrderCard({ order, toggleStatusHandler }) {
  // Convert the ISO date to the standard format
  const isoDate = new Date(order.orderDate);
  const orderDate = isoDate.toLocaleDateString("en-GB");
  const orderTime = isoDate.toLocaleTimeString("en-US", { hour12: false });

  return (
    <div className="w-full p-6 border-2 border-gray flex flex-row justify-between gap-7">
      {/* Primary Details */}
      <div className="w-1/3 flex flex-col justify-start items-start gap-4">
        {/* Order-ID and Icon */}
        <div className="w-full flex flex-row justify-start items-center gap-5">
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
      <div className="w-1/3 flex flex-col justify-center items-center gap-1.5">
        {order.orderedItems.map((item) => (
          <div
            key={`${item.product._id}-${item.size}-${
              item.quantity
            }-${Math.random()}`}
            className="w-full flex flex-col justify-start items-start font-main text-size-14 font-400"
          >
            <p className=" text-text-col-2 text-size-14">
              {`${item.product.name} ( ${item.size} x ${item.quantity} )`}
            </p>
          </div>
        ))}
      </div>
      {/* Order status */}
      <div className=" flex-grow flex flex-col justify-start items-end font-main font-400 text-text-col-2 text-size-16 gap-4">
        <p className="text-size-20 text-black font-500">{`$ ${order.orderValue}`}</p>
        <p className="text-size-14">
          {order.paymentMode ? "Cash On Delivery" : `${order.paymentMode}`}
        </p>
        {/* Change-Delivery-Status Selection Input */}
        <select
          name="delivery-status"
          id="delivery-status"
          className="w-fit outline-none p-2 border border-text-col-2"
          value={order.status}
          onChange={(e) => toggleStatusHandler(order._id, e.target.value)}
        >
          <option value="placed">Placed</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="out for delivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
    </div>
  );
}

export default AdminOrderCard;
