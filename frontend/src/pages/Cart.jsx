import React, { useEffect, useState } from "react";
import { CartItem, CartTotal, Loader, Button } from "../components";
import { databaseService } from "../service";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  storeDeleteItemFromCart,
  storePopulateCart,
  storeUpdateItemQtInCart,
} from "../store/cartSlice/cartSlice";
import toast from "react-hot-toast";

function Cart() {
  // local state
  const [loading, setLoading] = useState(true);
  const [localCart, setLocalCart] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartFromStore = useSelector((state) => state.cart.cart);
  const cartTotal = useSelector((state) => state.cart.cartTotal);

  // On Page load => Scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // On Page Load => Fetch cart from the database and populate the store
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await databaseService.getUserCart();
        if (response.success) {
          dispatch(storePopulateCart({ cart: response.data.cartItems }));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.log(
          `Cart items could not be fetched | Error = ${error.message}`
        );
        throw error;
      }
    })();
  }, []);

  // Whenever the store-cart changes => change the local state accordingly
  useEffect(() => {
    // set the local cart state
    setLocalCart(cartFromStore);

    // set loading to false
    setLoading(false);
  }, [cartFromStore]);

  /*
    WHY NOT SAVE THE UPDATED CART DATA JUST BEFORE THE COMPONENT UNMOUNTS?

    DOUBT: Instead of saving the updated cart information to the DB everytime the user makes changes (in product quantity), why not simply store the data locally and then upload everything at once just before the user refreshes the page or navigates away from the page?

    EXPLANATION: There is an event-listener "beforeunload" to ensure running some (synchronous) code just before the component unmounts. However, browsers tend to cancel any asynchronous operations once the component unmounts. So it's better to keep updating the database with the latest cart-information as soon as the user interacts with it.
  */

  // function to update product quantity in the cart (in the DB)
  const updateUserCartHandler = async (productId, size, quantity) => {
    try {
      const response = await databaseService.updateProductQtInCart(
        productId,
        size,
        quantity
      );
      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(`Product updation failed | Error = ${error.message}`);
      throw error;
    }
  };

  // function to remove the product from the cart (in the DB as well as the store)
  // NOTE: Since the local state is dependent on the store-cart, it will automatically change
  const removeProductFromCartHandler = async (item) => {
    try {
      const response = await databaseService.removeProductFromCart(
        item.product._id,
        item.size
      );
      if (response.success) {
        // delete the product from the cart store
        dispatch(
          storeDeleteItemFromCart({
            productId: item.product._id,
            size: item.size,
          })
        );

        // Show toast
        toast(`CART ITEM DELETED`, {
          duration: 1500,
          position: "top-center",
          icon: "✅",
          style: {
            fontFamily: "Outfit",
            fontWeight: "500",
            fontSize: "14px",
          },
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(`Product deletion failed | Error = ${error.message}`);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className=" border-y-[1.5px] border-y-gray  w-full flex-grow flex flex-col justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (localCart.length === 0) {
    return (
      <div className="border-y-[1.5px] border-y-gray py-12 w-full flex-grow flex flex-col justify-center items-center">
        <p className="font-main font-400 text-black text-size-20">
          You have no items in your cart.
        </p>
        <p className="font-main font-400 text-black text-size-14">
          Add some items and come back later.
        </p>
      </div>
    );
  }

  return (
    <div className="border-y-[1.5px] border-y-gray py-12 w-full flex-grow flex flex-col justify-start items-center gap-4">
      {/* Headline */}
      <p className="w-full text-left font-main font-500 text-size-24 text-black-2">
        YOUR CART
      </p>
      {/* Cart Items List */}
      <div className=" w-full flex flex-col justify-start items-center mb-5">
        {localCart.map((item, index) => (
          <CartItem
            key={index}
            cartItem={item}
            value={item.quantity}
            disabled={false}
            onChange={async (e) => {
              // change the quantity of the item in the store cart
              // NOTE: quantity of the item in the local state automatically changes (dependent on store cart)
              dispatch(
                storeUpdateItemQtInCart({
                  productId: item.product._id,
                  size: item.size,
                  qt: Number(e.target.value),
                })
              );

              // change the quantity of the item in the database
              await updateUserCartHandler(
                item.product._id,
                item.size,
                Number(e.target.value)
              );
            }}
            deleteItemHandler={async (e) => {
              // remove the product from the DB
              await removeProductFromCartHandler(item);
            }}
          />
        ))}
      </div>

      {/* Cart Total */}
      <div className=" w-full flex flex-row items-center justify-start">
        <div className="w-full sm:w-1/2 lg:w-2/5">
          <CartTotal amount={cartTotal} />
        </div>
      </div>

      {/* Place Order button */}
      <div className="w-full  flex flex-row items-center justify-start">
        <Button
          type="button"
          btnText="PROCEED TO CHECKOUT"
          className=" w-full sm:w-fit p-3 text-size-14"
          onClick={() => {
            // navigate to the checkout page
            navigate("/checkout");
          }}
        />
      </div>
    </div>
  );
}

export default Cart;
