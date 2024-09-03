import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/config.js";

// Initialization of an express app
const app = express();

// Middlewares for the express app

app.use(express.json()); // EXPRESS BUILT-IN MIDDLEWARE for parsing the request body to JSON format

app.use(express.static("../public")); // EXPRESS BUILT-IN MIDDLEWARE for serving static files

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
); // EXPRESS BUILT-IN MIDDLEWARE for handling and parsing the url-encoded data from forms to plain and readable Javascript
/*
    WHAT IS URL-ENCODED DATA?
    When working with forms, many entries contain some characters that must be converted to their ASCII codes before sending/submitting the form data to the server (for example, whitespaces and ampersand). So the raw data is URL-encoded before sending the server.

    WHAT DOES `express.urlencoded()` MIDDLEWARE DO?
    `express.urlencoded()` midlleware parses the URL-encoded data (sent by the client) and converts it to plain JS objects and populates the parsed data to req.body object of the HTTP request.
    => `extended:true` option means that the nested objects will also be decoded/parsed from the URL-encoded data.
    => `limit:"16kb"` defines the size limit of the payload data that the this middleware can accept and parse.
*/

app.use(cookieParser()); // gives access to the req.cookie object => enables setting and accessing cookies

app.use(
  cors({
    credentials: true,
    origin: config.app.corsOrigin,
  })
); // gives access to (only) specified domains to hit the server endpoints

// Router imports
import { API_VERSION } from "./constants.js";
import { userRouter } from "./routes/index.js";

app.use(`/api/${API_VERSION}/users`, userRouter);

export default app;
