const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;
  error.statusCode = err.statusCode || 500;

  // If errorResponse with baseResponse
  let data = {
    isSuccess: false,
    message: error.statusCode === 500 ? "INTERNAL_SERVER_ERROR" : error.message,
  };
  // If errorResponse with resultResponse
  if (error.result) data["result"] = error.result;

  // Log to console for dev
  if (error.statusCode === 400 || error.statusCode === 404) {
    console.log(
      error.stack.split("\n")[0].trim() + error.stack.split("\n")[1].trim()
    );
  }

  // status code 500 or unknown error
  if (error.statusCode === 500 || !error.statusCode) {
    // logger.error("UNHANDLED ERROR : \n", error);
    console.log("UNHANDLED ERROR : \n", error);
  }

  return res.status(error.statusCode).json(data);
};

module.exports = errorHandler;
