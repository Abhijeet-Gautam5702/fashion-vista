import React, { useEffect, useState } from "react";
import { CartItem, CartTotal, Loader } from "../components";
import { databaseService } from "../service";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { storePopulateCart } from "../store/cartSlice/cartSlice";

function Cart() {
  // local state
  const [loading, setLoading] = useState(true);
  const [localCart, setLocalCart] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartFromStore = useSelector((state) => state.cart.cart);
  const cartTotal = useSelector((state) => state.cart.cartTotal);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [localCart]);

  // On Page Load => Fetch cart from the database and populate the store
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await databaseService.getUserCart();
        if (response && response.data) {
          dispatch(storePopulateCart({ cart: response.data.cartItems }));
        }
      } catch (error) {
        console.log(
          `Cart items could not be fetched | Error = ${error.message}`
        );
        throw error;
      }
    })();
  }, []);

  // Whenever the store-cart changes => set the local state accordingly
  useEffect(() => {
    setLocalCart(cartFromStore);
    setLoading(false);
  }, [cartFromStore]);

  if (loading) {
    return (
      <div className=" border-y-[1.5px] border-y-gray  w-full flex-grow flex flex-col justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="border-y-[1.5px] border-y-gray py-12 w-full flex-grow flex flex-col justify-start items-center gap-4">
      <p className="w-full text-left font-main font-500 text-size-24 text-black-2">
        YOUR CART
      </p>
      <div className=" w-full flex flex-col justify-start items-center mb-5">
        {localCart.map((item, index) => (
          <CartItem key={index} cartItem={item} />
        ))}
      </div>
      {/* Cart Total */}
      <CartTotal amount={cartTotal} />
    </div>
  );
}

export default Cart;
