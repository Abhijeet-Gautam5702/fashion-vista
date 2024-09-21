import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { databaseService } from "../../service";
import { AdminOrderCard, Loader } from "../../components";
import toast from "react-hot-toast";

function Orders() {
  // local state
  const [loading, setLoading] = useState(true);
  const [localOrders, setLocalOrders] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const storeAuth = useSelector((state) => state.auth);
  const storeOrder = useSelector((state) => state.order);

  // On Page load => Scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // On Page Load => Fetch the orders' data from the database and populate the local orders list
  useEffect(() => {
    // NOTE: We can invoke this function every 10 minutes (using setTimeOut) to ensure that any latest orders are fetched after every 10-min interval
    fetchAllOrdersFromDB();
  }, []);

  const fetchAllOrdersFromDB = async () => {
    setLoading(true);
    try {
      const response = await databaseService.getAllOrders();
      if (response.success) {
        setLocalOrders(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(`Could not fetch order details | Error = ${error.message}`);
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleStatusHandler = async (orderId, status) => {
    try {
      const response = await databaseService.updateOrderStatus(orderId, status);
      if (response) {
        await fetchAllOrdersFromDB();

        // Show toast
        toast(`PACKAGE STATUS UPDATED`, {
          duration: 1500,
          position: "top-center",
          icon: "✅",
          style: {
            fontFamily: "Outfit",
            fontWeight: "500",
            fontSize: "14px",
          },
        });
      }
    } catch (error) {
      console.log(
        `Status of Order could not be changed | Error = ${error.message}`
      );
      // throw error;
    }
  };

  if (loading) {
    return (
      <div className="w-full flex-grow flex flex-row justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex flex-col justify-start items-center py-5 px-8 gap-3">
      <p className="w-full text-left font-main text-size-24 text-text-col-2">
        ORDERS
      </p>
      {/* Orders List */}
      <div className="w-full flex flex-col justify-start items-center gap-4 pr-20">
        {localOrders.map((item) => (
          <AdminOrderCard
            key={item._id}
            order={item}
            toggleStatusHandler={toggleStatusHandler}
          />
        ))}
      </div>
    </div>
  );
}

export default Orders;
