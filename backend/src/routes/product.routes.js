import { Router } from "express";
import { authenticateUser } from "../middlewares/index.js";
import {
  addProductToCart,
  clearCart,
  getAllProducts,
  getCurrentProduct,
  removeProductFromCart,
  updateProductQtInCart,
} from "../controllers/index.js";

const productRouter = Router();

// Unsecured routes (Authentication not needed)
productRouter.route("/").get(getAllProducts);
productRouter.route("/:productId").get(getCurrentProduct);

// Secured routes (Authentication via token required)
productRouter.route("/add-to-cart").post(authenticateUser, addProductToCart);
productRouter
  .route("/remove-from-cart")
  .put(authenticateUser, removeProductFromCart);
productRouter
  .route("/update-product-qt-in-cart")
  .put(authenticateUser, updateProductQtInCart);

productRouter.route("/cart/clear-cart").delete(clearCart);

export default productRouter;
