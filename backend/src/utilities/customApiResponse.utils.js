// Custom API-Response class to standardize the structure in which responses will be sent by the controller functions
/*
    NOTE: Wherever required, an instance of the CustomApiResponse class (known as an object) will be created and appropriate message,statusCode,data will be provided
*/
class CustomApiResponse {
  // instance properties
  data;
  success;
  message;
  statusCode;

  // constructor
  constructor(statusCode, message, data) {
    this.success = true;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default CustomApiResponse;
