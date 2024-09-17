import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Footer, Header, Loader } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { storePopulateInventory } from "./store/inventorySlice/inventorySlice";
import { authService, databaseService } from "./service/index.js";
import { storeLogin } from "./store/authSlice/authSlice";
import { Toaster } from "react-hot-toast";
import { storePopulateCart } from "./store/cartSlice/cartSlice.js";

function App() {
  // local state
  const [loading, setLoading] = useState(true);

  const storeAuth = useSelector((state) => state.auth);
  const storeCart = useSelector((state) => state.cart);
  const storeInventory = useSelector((state) => state.inventory);

  const dispatch = useDispatch();

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
        throw error;
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
          throw error;
        }
      })();
    }
  }, [storeAuth]);

  // Fetch data from the database and populate the inventory store
  useEffect(() => {
    (async () => {
      const response = await databaseService.getAllProducts();
      const productsInStock = response.data.filter(
        (item) => item.stock === true
      );
      dispatch(storePopulateInventory({ inventory: productsInStock }));
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-screen">
        <Loader />
      </div>
    );
  }

  // A completely different JSX will be returned if "/admin" is visited
  return (
    <div className="flex flex-col justify-between items-center w-full">
      <Toaster />
      <div className="min-h-[80vh] flex-grow w-full px-32 flex flex-col justify-start items-center">
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
