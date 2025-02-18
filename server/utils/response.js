const sendResponse = (res, success, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({ success, message, data });
};

const sendSuccess = (res, message, data = null, statusCode = 200) =>
  sendResponse(res, true, message, data, statusCode);

const sendError = (res, message, data = null, statusCode = 500) =>
  sendResponse(res, false, message, data, statusCode);

const sendValidationError = (res, message, data = null, statusCode = 400) =>
  sendError(res, message, data, statusCode);

export { sendSuccess, sendError, sendValidationError };
