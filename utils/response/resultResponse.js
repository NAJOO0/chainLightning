const resultResponse = ({ isSuccess, message }, result) => {
  return {
    isSuccess: isSuccess,
    message: message,
    result: result,
  };
};

module.exports = resultResponse;
