import { Router } from "express";
import { authenticateUser } from "../middlewares/index.js";
import {
  getOrderHistory,
  cancelOrder,
  placeOrder,
} from "../controllers/index.js";

const orderRouter = Router();

// Secured route
orderRouter.route("/").get(authenticateUser, getOrderHistory);

// Secured route
orderRouter.route("/place-order").post(authenticateUser, placeOrder);

// Secured route
orderRouter.route("/cancel-order").delete(authenticateUser, cancelOrder);

export default orderRouter;
