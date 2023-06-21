const sendError = (res, statusCode, message) => {
  res?.status(statusCode).json({
    success: "false",
    message,
  });
};

const sendSuccess = (res, statusCode, data) => {
  res.status(statusCode).json({
    success: "true",
    ...data,
  });
};
module.exports = { sendError, sendSuccess };
