class errorResponse extends Error {
  constructor(errorMessage, statusCode) {
    super(errorMessage.message);
    this.statusCode = statusCode || 500;
    this.isSuccess = errorMessage.isSuccess;
  }
}

module.exports = errorResponse;
