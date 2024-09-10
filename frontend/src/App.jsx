import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Footer, Header } from "./components";
import { useSelector, useDispatch } from "react-redux";
import { storePopulateInventory } from "./store/inventorySlice/inventorySlice";
import { authService, databaseService } from "./service/index.js";
import { storeLogin } from "./store/authSlice/authSlice";
import { Toaster } from "react-hot-toast";

function App() {
  const inventory = useSelector((state) => state.inventory.inventory);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Get the currently logged-in user
    (async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response) {
          dispatch(storeLogin({ userData: response.data }));
        }
      } catch (error) {
        console.log(`Could not fetch current user details | Error = ${error.message}`)
        throw error;
      }
    })();
  }, []);

  useEffect(() => {
    // Remove this later (This is a functionality which would be invoked only when login is being done)
    // setUser(userData);
  }, [userData]);

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
