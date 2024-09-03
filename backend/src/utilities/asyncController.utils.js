// Asynchornous code wrapper that takes an async callback function (the controller) and returns an async function with a try-catch block structure

/*
    NOTE: The parameters "req", "res", "next" will be present in the async controller function by default; asyncController(controller) will simply return an asynchronous function that will invoke the controller function (or return a failure message if things don't go well).
*/
const asyncController = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        statusCode: error.statusCode || 500,
        message: error.message || "BACKEND ERROR || Some unknown error occured",
        errors: error.errors,
        success: false,
      });
      /*
        NOTE: NEVER THROW AN ERROR!! Instead, return a response. 
        If you throw an error, the backend server will stop and won't work at all. But we want to send a bad-response to the client, so we simply send a response instead of throwing an error.
      */
    }
  };
};

export default asyncController;
