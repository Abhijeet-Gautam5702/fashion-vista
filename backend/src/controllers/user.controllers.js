import mongoose from "mongoose";
import { User } from "../models/index.js";
import {
  asyncController,
  CustomApiError,
  CustomApiResponse,
} from "../utilities/index.js";
import {
  ZodEmailSchema,
  ZodNameSchema,
  ZodPasswordSchema,
} from "../schema/zod.schema.js";

const createAccount = asyncController(async (req, res, next) => {
  // Get the user account details from req.body
  const { name, email, password } = req.body;

  // Validate the data
  const isNameValid = ZodNameSchema.safeParse(name);
  const isEmailValid = ZodEmailSchema.safeParse(email);
  const isPasswordValid = ZodPasswordSchema.safeParse(password);

  if (!isNameValid.success) {
    throw new CustomApiError(
      400,
      "Name is not valid",
      isNameValid.error.issues
    );
  }
  if (!isEmailValid.success) {
    throw new CustomApiError(
      400,
      "Email is not valid",
      isEmailValid.error.issues
    );
  }
  if (!isPasswordValid.success) {
    throw new CustomApiError(
      400,
      "Password is not valid",
      isPasswordValid.error.issues
    );
  }

  // Check if the user already exists in the database
  const userFromDB = await User.findOne({
    email,
  });
  if (userFromDB) {
    throw new CustomApiError(
      409,
      `ACCOUNT CREATION FAILED || User already exists`
    );
  }

  // Create a new User document
  const newUser = await User.create({ name, email, password });

  // Exclude sensitive information and send response to the client
  /*
    MINIMIZE THE NUMBER OF DATABASE CALLS
    - If the user document would have been successfully created => "newUser" will have all the data. So simply create a new object and include only those fields that are required to be sent to the client.
    - If the user document was not created successfully => it will throw an error and will automatically be handled by asyncController catch-block
  */
  const selectedFields = ["name", "email", "adminPermission"];
  let userData = {};
  selectedFields.forEach((field) => {
    userData[field] = newUser[field];
  });

  res
    .status(200)
    .json(new CustomApiResponse(200, `ACCOUNT CREATION SUCCESSFUL`, userData));
});

const createLoginSession = asyncController((req, res, next) => {});

const removeLoginSession = asyncController((req, res, next) => {});

const getLoggedInUser = asyncController((req, res, next) => {});

export {
  createAccount,
  createLoginSession,
  removeLoginSession,
  getLoggedInUser,
};
