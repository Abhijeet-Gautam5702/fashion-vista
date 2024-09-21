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

// Cookie Options
const cookieOptions = {
  httpOnly: true, // prevents client-side JS to access/read the cookies
  secure: true, // ensures that cookies are sent via HTTPS only
  sameSite: "none", // allows the cookies to be sent to different domains (resolves CORS issues)
  path: "/", // determines which paths (in the browser URL) can access the cookies
};

// Unauthenticated Route
const createAccount = asyncController(async (req, res, next) => {
  // Get the user account details from req.body
  const { name, email, password } = req.body;

  // Validate the data
  const isNameValid = ZodNameSchema.safeParse(name);
  const isEmailValid = ZodEmailSchema.safeParse(email);
  const isPasswordValid = ZodPasswordSchema.safeParse(password);

  if (!isNameValid.success) {
    throw new CustomApiError(400, "INVALID NAME", isNameValid.error.issues);
  }
  if (!isEmailValid.success) {
    throw new CustomApiError(400, "INVALID EMAIL", isEmailValid.error.issues);
  }
  if (!isPasswordValid.success) {
    throw new CustomApiError(
      400,
      "INVALID PASSWORD",
      isPasswordValid.error.issues
    );
  }

  // Check if the user already exists in the database
  const userFromDB = await User.findOne({
    email,
  });
  if (userFromDB) {
    throw new CustomApiError(409, `USER WITH THIS EMAIL ALREADY EXISTS`);
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

// Unauthenticated Route
const createLoginSession = asyncController(async (req, res, next) => {
  // Get user credentials from req.body
  const { email, password } = req.body;

  // Validate the data
  const isEmailValid = ZodEmailSchema.safeParse(email);
  const isPasswordValid = ZodPasswordSchema.safeParse(password);

  if (!isEmailValid.success) {
    throw new CustomApiError(400, "INVALID EMAIL", isEmailValid.error.issues);
  }
  if (!isPasswordValid.success) {
    throw new CustomApiError(
      400,
      "INVALID PASSWORD",
      isPasswordValid.error.issues
    );
  }

  // Check if the user is present in the database
  const userFromDB = await User.findOne({ email });
  if (!userFromDB) {
    throw new CustomApiError(404, `USER NOT FOUND IN THE DATABASE`);
  }

  // Match the password
  const isPasswordMatched = await userFromDB.matchPassword(password);
  if (!isPasswordMatched) {
    throw new CustomApiError(401, `INCORRECT PASSWORD`);
  }

  // Generate tokens
  const accessToken = userFromDB.createAccessToken();
  const refreshToken = userFromDB.createRefreshToken();

  // Set refresh token to the user document in database
  const updatedUserFromDB = await User.findOneAndUpdate(
    { email },
    { refreshToken },
    { new: true } // return the updated document
  );

  // Exclude sensitive information from the updated user document
  /*
    MINIMIZE THE NUMBER OF DATABASE CALLS
    - If the user document would have been successfully created => "newUser" will have all the data. So simply create a new object and include only those fields that are required to be sent to the client.
    - If the user document was not created successfully => it will throw an error and will automatically be handled by asyncController catch-block
  */
  const selectedFields = ["name", "email", "adminPermission", "refreshToken"];
  let userData = {};
  selectedFields.forEach((field) => {
    userData[field] = updatedUserFromDB[field];
  });

  // Send response to the client and set cookies
  res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      data: new CustomApiResponse(
        200,
        `LOGIN SESSION CREATED SUCCESSFULLY`,
        userData
      ).data,
      accessToken,
    });
});

// Authenticated route (User can remove a login session only if they have created one, i.e. they are logged-in)
const removeLoginSession = asyncController(async (req, res, next) => {
  // Auth Middleware: Check if the user is logged in (i.e. authenticated)

  // Get the userId of the logged-in user & remove the refresh token from the user-document in the database
  const userId = req.userData._id;
  const updatedUserFromDB = await User.findByIdAndUpdate(
    userId,
    { refreshToken: "" },
    { new: true } // return the updated document
  );

  // Exclude sensitive information from the updated user document
  /*
    MINIMIZE THE NUMBER OF DATABASE CALLS
    - If the user document would have been successfully created => "newUser" will have all the data. So simply create a new object and include only those fields that are required to be sent to the client.
    - If the user document was not created successfully => it will throw an error and will automatically be handled by asyncController catch-block
  */
  const selectedFields = ["name", "email", "adminPermission"];
  let userData = {};
  selectedFields.forEach((field) => {
    userData[field] = updatedUserFromDB[field];
  });

  // Clear all the tokens from the cookie and send response to the user
  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      new CustomApiResponse(200, `LOGIN SESSION REMOVED SUCCESSFULLY`, userData)
    );
});

// Authenticated route (User details can be fetched only if the user is logged-in)
const getLoggedInUser = asyncController(async (req, res, next) => {
  // Auth Middleware: Check if the user is logged in (i.e. authenticated)

  // Get the user details of the logged-in user from the database (using the userId)
  const user = req.userData;

  // Send response to the client
  res
    .status(200)
    .json(
      new CustomApiResponse(200, `USER DETAILS FETCHED SUCCESSFULLY`, user)
    );
});

export {
  createAccount,
  createLoginSession,
  removeLoginSession,
  getLoggedInUser,
};
