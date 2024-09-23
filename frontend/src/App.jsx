import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Footer, Header, Loader } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { storePopulateInventory } from "./store/inventorySlice/inventorySlice";
import { authService, databaseService } from "./service/index.js";
import { storeLogin } from "./store/authSlice/authSlice";
import { Toaster } from "react-hot-toast";
import { storePopulateCart } from "./store/cartSlice/cartSlice.js";
import checkServerHealth from "./utilities/checkServerHealth.js";

function App() {
  // local state
  const [loading, setLoading] = useState(true);
  const [loadingTimer, setLoadingTimer] = useState(65);

  const storeAuth = useSelector((state) => state.auth);
  const storeCart = useSelector((state) => state.cart);
  const storeInventory = useSelector((state) => state.inventory);

  const dispatch = useDispatch();

  // Put a countdown till the time backend gets active
  useEffect(() => {
    setInterval(() => {
      setLoadingTimer((prev) => prev - 1);
    }, 1000);
    setLoading(false);
  }, []);

  // Once the webpage is rendered, ping the backend every 10 minutes
  useEffect(() => {
    setInterval(async () => {
      await checkServerHealth();
    }, 10 * 60 * 1000);
  }, []);

  // Get the currently logged-in user
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response) {
          dispatch(storeLogin({ userData: response.data }));
        }
      } catch (error) {
        console.log(
          `Could not fetch current user details | Error = ${error.message}`
        );
        // throw error;
      }
    })();
  }, []);

  // If the user is logged-in => Populate the store with the cart of the user
  useEffect(() => {
    if (storeAuth.loginStatus) {
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
          // throw error;
        }
      })();
    }
  }, [storeAuth]);

  // Fetch data from the database and populate the inventory store
  useEffect(() => {
    (async () => {
      try {
        const response = await databaseService.getAllProducts();
        if (response.success) {
          const productsInStock = response.data.filter(
            (item) => item.stock === true
          );
          dispatch(storePopulateInventory({ inventory: productsInStock }));
          setLoading(false);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.log(
          `Failed to fetched inventory data from the database | Error = ${error.message}`
        );
        // throw error;
      } finally {
        // testing
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-screen">
        <p className="font-main font-500 text-size-20 text-black">
          {`Please wait patiently for ${loadingTimer} seconds`}
        </p>
        <p className="font-main font-500 text-size-17 text-black">
          The backend server has been inactive for quite some time
        </p>
        <Loader />
      </div>
    );
  }

  // A completely different JSX will be returned if "/admin" is visited
  return (
    <div className="flex flex-col justify-between items-center w-full">
      <Toaster />
      <div className="min-h-[80vh] flex-grow w-full px-4 sm:px-8 md:px-16 lg:px-32 flex flex-col justify-start items-center">
        <Header />
        <Container>
          <Outlet />
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default App;
