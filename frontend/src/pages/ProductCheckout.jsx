import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storeAddOrder } from "../store/orderSlice/orderSlice";
import { CartTotal, Button, Input } from "../components";
import { useForm } from "react-hook-form";
import { databaseService } from "../service";
import toast from "react-hot-toast";
import { storeClearCart } from "../store/cartSlice/cartSlice";

function ProductCheckout() {
  // local state
  const [loading, setLoading] = useState(false);

  const storeInventory = useSelector((state) => state.inventory.inventory);
  const storeAuth = useSelector((state) => state.auth);
  const storeCart = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  // On Page load => Scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // function to place order
  const placeOrderHandler = async (data) => {
    clearErrors();
    setLoading(true);
    try {
      // add the order details to the database

      const address = `${data.fullname}, ${data.street}, ${data.city}-${data.pincode}, ${data.state}, ${data.country}`;

      const response = await databaseService.placeOrder(
        address,
        data.phone,
        data.email,
        Number(storeCart.cartTotal + 10)
      );

      if (response.success) {
        // update the order slice
        dispatch(storeAddOrder({ order: response.data }));

        // clear the cart slice
        dispatch(storeClearCart());

        // Show toast
        toast(`ORDER PLACED`, {
          duration: 1500,
          position: "top-center",
          icon: "🎉",
          style: {
            fontFamily: "Outfit",
            fontWeight: "500",
            fontSize: "14px",
          },
        });

        reset(); // reset the form

        // navigate to the Orders Page
        navigate("/orders");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(
        `Could not update delivery address | Error = ${error.message}`
      );
      throw error;
    }
  };

  return (
    <div className="w-full flex-grow flex flex-row justify-between items-end gap-10 border-y-[1.5px] border-y-gray py-16">
      {/* Delivery address form */}
      <div className="w-1/2 flex flex-col justify-start items-stretch gap-6">
        <p className="font-main font-500 text-size-24 text-text-col-2">
          DELIVERY INFORMATION
        </p>
        <form className="w-full flex flex-col justify-start items-center gap-4 pr-10">
          <Input
            type={"text"}
            label=""
            placeholder={"Full name"}
            className="py-2"
            {...register("fullname", { required: true })}
          />

          <Input
            type={"text"}
            label=""
            placeholder={"Street"}
            className="py-2"
            {...register("street", { required: true })}
          />

          <div className="w-full flex flex-row justify-center items-center gap-4">
            <Input
              type={"text"}
              label=""
              placeholder={"City"}
              className="py-2"
              {...register("city", { required: true })}
            />
            <Input
              type={"text"}
              label=""
              placeholder={"Pincode"}
              className="py-2"
              {...register("pincode", { required: true })}
            />
          </div>

          <div className="w-full flex flex-row justify-center items-center gap-4">
            <Input
              type={"text"}
              label=""
              placeholder={"State"}
              className="py-2"
              {...register("state", { required: true })}
            />
            <Input
              type={"text"}
              label=""
              placeholder={"Country"}
              className="py-2"
              {...register("country", { required: true })}
            />
          </div>

          <Input
            type={"email"}
            label=""
            placeholder={"Email"}
            className="py-2"
            {...register("email", { required: true })}
          />

          <Input
            type={"tel"}
            label=""
            placeholder={"Phone"}
            className="py-2"
            {...register("phone", { required: true })}
          />
        </form>
      </div>

      {/* Cart Totals & Payments */}
      <div className="w-1/2 flex flex-col items-start justify-start gap-5">
        <CartTotal amount={storeCart.cartTotal} />
        {/* Payment Information */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <p className="w-full font-main font-500 text-size-16 text-text-col-2">
            PAYMENT METHOD
          </p>
          <div className="w-full flex flex-row justify-start items-start">
            <div className="font-main font-500 text-text-col-1 text-size-14 p-2 border-[1.5px] border-gray">
              CASH ON DELIVERY (COD)
            </div>
          </div>
        </div>
        {/* Place Order button */}
        <div className="w-full flex flex-row items-center justify-end">
          <Button
            type="submit"
            btnText="PLACE ORDER"
            className="p-3 text-size-14 min-w-[240px]"
            onClick={handleSubmit(placeOrderHandler)}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductCheckout;
