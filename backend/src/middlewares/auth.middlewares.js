import config from "../config/config.js";
import { User } from "../models/index.js";
import { asyncController, CustomApiError } from "../utilities/index.js";

import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const authenticateUser = asyncController(async (req, res, next) => {
  // Get the access token from the cookies
  const cookies = req.cookies;
  const { accessToken } = cookies;
  /*
    NOTE: Tokens are sent to cookies only in the cases of websites. In case of working with a mobile application, tokens are sent to the backend via the `Authorization` Header of the HTTP request.

    Had it been a mobile application at the frontend:-
    const accessToken = req.headers.authorization?.replace("Bearer ","");
  */

  if (!accessToken) {
    throw new CustomApiError(401, `AUTHENTICATION FAILED || NO COOKIES FOUND`);
  }

  // Decode the accessToken to get user information
  const decodedToken = jwt.verify(
    accessToken,
    config.token.accessToken.privateKey
  );

  // Get hold of the user document from the database using the access token
  const userId = decodedToken._id;
  const userFromDB = await User.findById(userId)?.select(
    "-password -refreshToken"
  );
  if (!userFromDB) {
    throw new CustomApiError(
      404,
      `AUTHENTICATION FAILED || INVALID ACCESS TOKEN || USER DOESN'T EXIST IN THE DATABASE`
    );
  }

  // Attach a new property to the req object and pass control to the next middleware (essentially the controller in our case)
  req.userData = userFromDB;
  next();
});

export default authenticateUser;
