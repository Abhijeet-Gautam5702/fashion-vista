import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Footer, Header } from "./components";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { storePopulateInventory } from "./store/inventorySlice/inventorySlice";
import { authService, databaseService } from "./service/index.js";
import { storeLogin } from "./store/authSlice/authSlice";

function App() {
  const inventory = useSelector((state) => state.inventory.inventory);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Remove this later (This is a functionality which would be invoked only when login is being done)
    (async () => {
      const userDataFromDB = await authService.login({
        email: "two@two.com",
        password: "Test123456@",
      });
      // console.log(userDataFromDB);
      dispatch(storeLogin({ userData: userDataFromDB.data }));
    })();
  }, []);

  useEffect(() => {
    // Remove this later (This is a functionality which would be invoked only when login is being done)
    setUser(userData);
  }, [userData]);

  // A completely different JSX will be returned if "/admin" is visited
  return (
    <>
      <div className="px-32">
        <Header />
        <Container>
          <Outlet />
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default App;
