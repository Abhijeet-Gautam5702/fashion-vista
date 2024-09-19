import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Loader, ProductCard, ProductSizeBox } from "../components";
import { databaseService } from "../service";
import { star_filled, star_outline } from "../assets";
import toast from "react-hot-toast";
import { storePopulateCart } from "../store/cartSlice/cartSlice";

function Product() {
  const inventory = useSelector((state) => state.inventory.inventory);
  const loginStatus = useSelector((state) => state.auth.loginStatus);
  const { productId } = useParams();
  const dispatch = useDispatch();

  // local state
  const [productDetails, setProductDetails] = useState({});
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Whenver the productId changes (i.e, the user clicks on some different product-card) => scroll smoothly to the top
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [productId]);

  /*
    REACT RE-RENDER FLOW

    - The component mounts and looks for the useEffects with empty dependency array
    - Since both the useEffects have non-empty dependency arrays, both of them get executed parallely (had there been a useEffect with an empty dependency array, it would have been executed immediately after the component mounts)
    - API call is made to the server and the `productDetails` & `sizes` states are updated
    - Parallely, the `relatedProducts` state is updated
    - React batches all the state updates and then re-renders the component
    - After re-rendering, the first useEffect doesn't execute but the 2nd useEffect does, as it is dependent on the `productDetails` state that had just been updated

    => Essentially, the first useEffect runs only once whereas the 2nd useEffect runs twice.
  */

  // Fetch the product details from the database whenever the productId changes (basically whenever a product card is clicked)
  useEffect(() => {
    (async () => {
      try {
        const response = await databaseService.getCurrentProduct(productId);
        if (response.success) {
          setProductDetails(response.data);
          setSizes(response.data.sizes);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.log(
          `Product details could not be fetched | Error = ${error.message}`
        );
      }
    })();
  }, [productId, inventory]);

  // Change the related-products according to the current product
  useEffect(() => {
    setRelatedProducts(findRelatedProductsAccToProductCategory());
    if (relatedProducts) {
      setLoading(false);
    }
  }, [productDetails]);

  // function to filter the inventory items and get the related-products according to the current product
  const findRelatedProductsAccToProductCategory = () => {
    const relatedProducts = inventory.filter(
      (item) =>
        item.category === productDetails.category && item._id !== productId
    );
    return relatedProducts;
  };

  const addToCartHandler = async () => {
    try {
      const response = await databaseService.addProductToCart({
        productId,
        size: selectedSize,
        quantity: 1,
      });

      if (response.success) {
        // add the product to the cart in store

        const cartResponse = await databaseService.getUserCart(); // get the cart from the database
        if (cartResponse) {
          dispatch(storePopulateCart({ cart: cartResponse.data.cartItems })); // populate the store with cart

          // Send toast
          toast("Product added to your cart", {
            duration: 1500,
            position: "top-center",
            icon: "✅",
            style: {
              fontFamily: "Outfit",
              fontWeight: "500",
              fontSize: "14px",
            },
          });

          setSelectedSize(null); //reset the selected size to default
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.log(
        `Could not add product to the cart | Error = ${error.message}`
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full flex-grow flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full flex-grow flex flex-col justify-start items-center gap-16 py-10">
      {/* Product Section */}
      <section className="w-full h-fit flex flex-row gap-10">
        {/* Left Images Panel */}
        <div className="w-5/12 flex flex-row items-center justify-center">
          {productDetails?.images?.length ? (
            <img
              className="w-full h-full object-cover"
              src={productDetails.images[0]}
              alt="Product image"
            />
          ) : (
            <p className="w-full text-center text-text-col-1 font-main font-400 text-size-12">
              Image could not be loaded for this product
            </p>
          )}
        </div>

        {/* Product details Panel */}
        <div className="w-2/5 flex flex-col justify-start items-start gap-3 font-main leading-none">
          {/* Product name */}
          <p className="text-black text-size-24 font-500">
            {productDetails.name}
          </p>
          {/* Rating */}
          <div className="flex flex-row justify-start items-center gap-1">
            <img className="w-[18px] h-auto" src={star_filled} alt="" />
            <img className="w-[18px] h-auto" src={star_filled} alt="" />
            <img className="w-[18px] h-auto" src={star_filled} alt="" />
            <img className="w-[18px] h-auto" src={star_filled} alt="" />
            <img className="w-[18px] h-auto" src={star_outline} alt="" />
          </div>
          {/* Product price */}
          <p className="text-black text-size-30 font-500 my-4">
            $ {productDetails.price}
          </p>
          {/* Product description */}
          <p className="text-text-col-1 text-size-16 font-400 leading-normal">
            {productDetails.description}
          </p>
          {/* Product size selection */}
          <div className="mt-4 flex flex-col justify-start items-start gap-3">
            <p className="text-black text-size-16 font-400">Select size</p>
            <div className="w-full flex flex-row justify-start items-center gap-3">
              {sizes.map((item) => (
                <ProductSizeBox
                  key={item}
                  sizeText={item}
                  className={`min-w-[40px] ${
                    selectedSize === item
                      ? " bg-accent-2 font-600 "
                      : " bg-base "
                  }`}
                  onClick={() => {
                    // change the selectedSize local state
                    setSelectedSize(item);
                    // change the appearance of the button based on the selected size
                  }}
                />
              ))}
            </div>
          </div>
          {/* Add to Cart button */}
          <Button
            btnText="ADD TO CART"
            type="button"
            className="text-size-14 font-main font-400 py-4 px-7 mt-5"
            onClick={() => {
              // If no size is selected => Send a toast
              if (!selectedSize) {
                toast("PLEASE SELECT A SIZE OF THE PRODUCT", {
                  duration: 1500,
                  position: "top-center",
                  icon: "❌",
                  style: {
                    fontFamily: "Outfit",
                    fontWeight: "500",
                    fontSize: "14px",
                  },
                });
                return;
              }
              if (!loginStatus) {
                toast("PLEASE LOGIN TO ADD ITEM TO CART", {
                  duration: 1500,
                  position: "top-center",
                  icon: "🔒",
                  style: {
                    fontFamily: "Outfit",
                    fontWeight: "500",
                    fontSize: "14px",
                  },
                });
                return;
              }

              addToCartHandler();
              // Change the badge on the cart displaying the number of items in the cart
            }}
          />
          <hr className="h-[1px] bg-text-col-1 w-full my-6" />
          {/* Policies related to the product shipping */}
          <div className="font-main text-text-col-1 font-400 text-size-14 space-y-2">
            <p>100% original product</p>
            <p>Cash On Delivery available on this product</p>
            <p>Easy return and exchange policy within 30 days</p>
          </div>
        </div>
      </section>

      {/* Related products Section */}
      <section className="w-full h-fit flex flex-col gap-4">
        <p className="w-full text-center font-400 text-size-30 text-text-col-2">
          RELATED PRODUCTS
        </p>
        <div className="w-full flex flex-row flex-wrap justify-start items-center gap-5">
          {relatedProducts.map((item) => (
            <ProductCard
              key={item._id}
              name={item.name}
              path={`/product/${item._id}`}
              price={item.price}
              image={item.images[0]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Product;
