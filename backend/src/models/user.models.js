import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

// Create userSchema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    adminPermission: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, validateBeforeSave: true }
);
// NOTE: "validateBeforeSave: true" ensures that the mongoose built-in validation checks are enabled (it checks and enforces required values, enum values, min/max values etc. and throws errors)

// Pre-middleware: Encrypt the password (using bcrypt) before saving it to database
userSchema.pre("save", async function () {
  try {
    // if the password is modified, then hash it
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  } catch (error) {
    console.log(
      `BACKEND ERROR || Password could not be hashed || Error = ${error.message}`
    );
    throw error;
  }
});

// Mongoose method: Generate refresh token for the user (to be stored in database)
/*
    REFRESH TOKEN USE?
    Refresh token is stored in the cookie and sent to the backend by the client for generating a new access token. Backend will match the refresh token sent by the client with the refresh token stored in the user-document.
*/
userSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    config.token.refreshToken.privateKey,
    {
      expiresIn: config.token.refreshToken.expiry,
    }
  );
};

// Mongoose method: Generate access token for the user (not to be stored in database)
/*
    ACCESS TOKEN USE?
    Access token is stored in the cookie and fetched by the backend whenever the client hits a protected route, without the need to provide login credentials again.
*/
userSchema.methods.createAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    config.token.accessToken.privateKey,
    { expiresIn: config.token.accessToken.expiry }
  );
};

// Mongoose method: Compare the password with the hash stored in database
userSchema.methods.matchPassword = async function (password) {
  try {
    const isPasswordMatched = await bcrypt.compare(password, this.password);
    return isPasswordMatched;
  } catch (error) {
    console.log(
      `BACKEND ERROR || Password matching failed || Error = ${error.message}`
    );
    throw error;
  }
};

// Create a user model from userSchema
const User = mongoose.model("User", userSchema);

export default User;
