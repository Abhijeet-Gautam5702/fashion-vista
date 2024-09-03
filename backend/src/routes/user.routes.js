import { Router } from "express";
import {
  createAccount,
  createLoginSession,
  getLoggedInUser,
  removeLoginSession,
} from "../controllers/user.controllers.js";

const userRouter = Router();

// Unsecured routes (no authentication needed)
userRouter.route("/create-account").post(createAccount);
userRouter.route("/login").post(createLoginSession);

// Secured routes (Access Token authentication needed)
userRouter.route("/get-current-user").get(getLoggedInUser);
userRouter.route("/logout").post(removeLoginSession);


export default userRouter;
