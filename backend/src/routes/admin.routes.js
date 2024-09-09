import { Router } from "express";
import { authenticateAdmin, multerUpload } from "../middlewares/index.js";
import {
  createAdminLoginSession,
  removeAdminLoginSession,
  getCurrentAdmin,
  addNewProductToInventory,
  deleteProductFromInventory,
  updateDeliveryStatusOfOrder,
  addImagesOfProductInInventory,
} from "../controllers/index.js";
// import { multerUploader } from "../utilities/index.js";

const adminRouter = Router();

// Unsecured route
adminRouter.route("/create-admin-login-session").post(createAdminLoginSession);

// Secured routes
adminRouter
  .route("/remove-admin-login-session")
  .delete(authenticateAdmin, removeAdminLoginSession);
adminRouter.route("/get-current-admin").get(authenticateAdmin, getCurrentAdmin);
adminRouter
  .route("/add-new-product-to-inventory")
  .post(authenticateAdmin, addNewProductToInventory);
adminRouter.route("/add-images-of-product-in-inventory").put(
  authenticateAdmin,
  multerUpload, // Multer Uploader middleware (Refactor the middleware function)
  addImagesOfProductInInventory
);
adminRouter
  .route("/delete-product-from-inventory")
  .delete(authenticateAdmin, deleteProductFromInventory);
adminRouter
  .route("/update-order-status")
  .put(authenticateAdmin, updateDeliveryStatusOfOrder);


export default adminRouter;
