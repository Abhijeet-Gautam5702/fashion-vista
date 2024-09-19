import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader, OrderCard, OrderedProductCard } from "../components";
import { databaseService } from "../service";
import { storePopulateOrders } from "../store/orderSlice/orderSlice";

function Orders() {
  // local state
  const [loading, setLoading] = useState(true);
  const [localOrders, setLocalOrders] = useState([]);

  const storeAuth = useSelector((state) => state.auth);
  const storeCart = useSelector((state) => state.cart.cart);
  const storeInventory = useSelector((state) => state.inventory.inventory);
  const storeOrders = useSelector((state) => state.order.orders);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // On Page Load => scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // On Page Load => Fetch current user's order history and populate the store
  useEffect(() => {
    (async () => {
      try {
        const response = await databaseService.getOrderHistory();
        if (response.success) {
          dispatch(storePopulateOrders({ orders: response.data }));
        } else{
          throw new Error(response.message)
        }
      } catch (error) {
        console.log(
          `Could not fetch user's order history | Error = ${error.message}`
        );
        throw error;
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Change local state whenever order slice in store changes
  useEffect(() => {
    setLocalOrders(storeOrders);
  }, [storeOrders]);

  if (loading) {
    return (
      <div className="w-full flex-grow border-y-[1.5px] border-y-gray flex flex-col items-center justify-center">
        <Loader/>
      </div>
    )
  }

  
  if (localOrders.length === 0) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center">
        <p className="font-main font-400 text-black text-size-20">
          You have not placed any orders with us till now.
        </p>
        <p className="font-main font-400 text-black text-size-14">
          Place at least one order and come again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-16 flex-grow border-y-[1.5px] border-y-gray flex flex-col items-center justify-start gap-7">
      <p className="w-full text-left font-main font-500 text-text-col-2 text-size-24">
        MY ORDERS
      </p>
      {/* Orders list */}
      <div className="w-full flex flex-col justify-start items-center">
        {localOrders.map((item) => (
          <OrderCard order={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}

export default Orders;
