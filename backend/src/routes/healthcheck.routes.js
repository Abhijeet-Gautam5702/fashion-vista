import express from "express";
import { healthCheck } from "../controllers/index.js";

const healthCheckRouter = express.Router();

// Unauthenticated route
healthCheckRouter.route("/healthcheck").get(healthCheck);

export default healthCheckRouter;
