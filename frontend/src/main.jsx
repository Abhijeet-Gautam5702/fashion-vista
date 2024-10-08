import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AdminApp from "./AdminApp.jsx";
import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Home,
  Collections,
  About,
  Contact,
  Cart,
  ProductCheckout,
  Product,
  Error,
  Orders,
  Login,
  Signup,
  AddItems,
  Inventory,
  AdminOrders,
  AdminLogin,
} from "./pages";
import { AdminProtected, Protected } from "./layouts";

import { Provider } from "react-redux";
import store from "./store/store.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Protected authentication={false}>
            <Home />
          </Protected>
        ),
      },
      {
        path: "/collections",
        element: (
          <Protected authentication={false}>
            <Collections />
          </Protected>
        ),
      },
      {
        path: "/about",
        element: (
          <Protected authentication={false}>
            <About />
          </Protected>
        ),
      },
      {
        path: "/contact-us",
        element: (
          <Protected authentication={false}>
            <Contact />
          </Protected>
        ),
      },
      {
        path: "/product/:productId",
        element: (
          <Protected authentication={false}>
            <Product />
          </Protected>
        ),
      },
      {
        path: "/login",
        element: (
          <Protected authentication={false}>
            <Login />
          </Protected>
        ),
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false}>
            <Signup />
          </Protected>
        ),
      },
      {
        path: "/cart",
        element: (
          <Protected authentication>
            <Cart />
          </Protected>
        ),
      },
      {
        path: "/orders",
        element: (
          <Protected authentication>
            <Orders />
          </Protected>
        ),
      },
      {
        path: "/checkout",
        element: (
          <Protected authentication>
            <ProductCheckout />
          </Protected>
        ),
      },
    ],
    errorElement: <Error />,
  },
  {
    path: "/admin",
    element: <AdminApp />,
    children: [
      {
        path: "/admin/",
        element: (
          <AdminProtected>
            <AdminLogin />
          </AdminProtected>
        ),
      },
      {
        path: "/admin/add-items",
        element: (
          <AdminProtected authentication>
            <AddItems />
          </AdminProtected>
        ),
      },
      {
        path: "/admin/inventory",
        element: (
          <AdminProtected authentication>
            <Inventory />
          </AdminProtected>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <AdminProtected authentication>
            <AdminOrders />
          </AdminProtected>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </StrictMode>
);
