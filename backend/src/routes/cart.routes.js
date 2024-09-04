import { Router } from "express";
import { authenticateUser } from "../middlewares/index.js";
import { clearCart, getCart } from "../controllers/index.js";

const cartRouter = Router();

// Secured routes (Authentication of user required)
cartRouter.route("/get-cart").get(authenticateUser, getCart);
cartRouter.route("/clear-cart").delete(authenticateUser, clearCart);

export default cartRouter;
