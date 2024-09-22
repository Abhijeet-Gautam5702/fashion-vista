import { asyncController, CustomApiResponse } from "../utilities/index.js";

const healthCheck = asyncController(async (req, res, next) => {
  res.status(200).json(new CustomApiResponse(200, "All Good", {}));
});


export  {healthCheck};