import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
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
} from "./pages";
import { Protected } from "./layouts";

import { Provider } from "react-redux";
import store from "./store/store.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/collections",
        element: <Collections />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact-us",
        element: <Contact />,
      },
      {
        path: "/product/:productId",
        element: <Product />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
