const AppError = require("./AppError");

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, ...(err.details ? { details: err.details } : {}) });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body is not valid JSON." });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our side. Try again in a moment." });
};
