import {
  createAccount,
  createLoginSession,
  removeLoginSession,
  getLoggedInUser,
} from "./user.controllers.js";
import {
  getAllProducts,
  getCurrentProduct,
  addProductToCart,
  removeProductFromCart,
  updateProductQtInCart,
} from "./products.controllers.js";
import { getCart, clearCart } from "./cart.controllers.js";
import {
  placeOrder,
  cancelOrder,
  getOrderHistory,
} from "./order.controllers.js";
import { addProductToInventory } from "./admin.controllers.js";

export {
  createAccount,
  createLoginSession,
  removeLoginSession,
  getLoggedInUser,
  getAllProducts,
  getCurrentProduct,
  addProductToCart,
  removeProductFromCart,
  addProductToInventory,
  updateProductQtInCart,
  clearCart,
  getCart,
  placeOrder,
  cancelOrder,
  getOrderHistory,
};
