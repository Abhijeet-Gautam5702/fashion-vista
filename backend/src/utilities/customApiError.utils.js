// Cusom API-Error class to handle and standardize the errors thrown by the controllers
/*
    NOTE:
    - CustomApiError class extends the built-in Error class of Node-JS. It has other instance properties beyond the "message" property in the built-in Error class. So CustomApiError class will have access to "message" property of Error class as well as the custom instance properties that we have defined.

    - We want to populate the "message" variable with the message provided as argument in our custom constructor. So we call the constructor of the parent Error-class using "super(message)" with the message property so that the "message" get populated, and populate the other properties manually.
*/
class CustomApiError extends Error {
  // instance properties
  success;
  statusCode;
  data;
  error;

  // constructor
  constructor(statusCode, message, error) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.success = false;
    this.data = null;
  }
}

export default CustomApiError;
