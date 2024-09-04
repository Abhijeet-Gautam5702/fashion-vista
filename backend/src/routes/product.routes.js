import { Router } from "express";
import {
  addProductToCart,
  getAllProducts,
  getCurrentProduct,
  removeProductFromCart,
} from "../controllers/index.js";
import { authenticateUser } from "../middlewares/index.js";

const productRouter = Router();

// Unsecured routes (Authentication not needed)
productRouter.route("/").get(getAllProducts);
productRouter.route("/:productId").get(getCurrentProduct);

// Secured routes (Authentication via token required)
productRouter
  .route("/add-to-cart")
  .post(authenticateUser, addProductToCart);
productRouter
  .route("/remove-from-cart?productId")
  .delete(authenticateUser, removeProductFromCart);

export default productRouter;
