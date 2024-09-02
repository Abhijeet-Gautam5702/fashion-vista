// Asynchornous code wrapper that takes a callback function (the controller) and returns an async function

/*
    NOTE: The parameters "req", "res", "next" will be present in the controller function by default; asyncController(controller) will simply return an asynchronous function that will invoke the controller function (or return a failure message if things don't go well).
*/
const asyncController = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        statusCode: error.statusCode || 500,
        message:
          error.message ||
          "ASYNC-CONTROLLER ERROR || Some unknown error occured",
        success: false,
      });
    }
  };
};

export default asyncController;
