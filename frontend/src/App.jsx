import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Footer, Header, Loader } from "./components";
import { useDispatch } from "react-redux";
import { storePopulateInventory } from "./store/inventorySlice/inventorySlice";
import { authService, databaseService } from "./service/index.js";
import { storeLogin } from "./store/authSlice/authSlice";
import { Toaster } from "react-hot-toast";

function App() {
  // local state
  const [loading, setLoading] = useState(true);

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

  // Fetch data from the database and populate the inventory store
  useEffect(() => {
    (async () => {
      const productsFromDB = await databaseService.getAllProducts();
      dispatch(storePopulateInventory({ inventory: productsFromDB.data }));
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
