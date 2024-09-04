import { Router } from "express";
import {
  createAccount,
  createLoginSession,
  getLoggedInUser,
  removeLoginSession,
} from "../controllers/index.js";
import {authenticateUser} from "../middlewares/index.js";

const userRouter = Router();

// Unsecured routes (no authentication needed)
userRouter.route("/create-account").post(createAccount);
userRouter.route("/create-login-session").post(createLoginSession);

// Secured routes (Access Token authentication needed)
userRouter.route("/get-current-user").get(authenticateUser, getLoggedInUser);
userRouter
  .route("/remove-login-session")
  .post(authenticateUser, removeLoginSession);

export default userRouter;
