const errorMiddleware = (err, req, res, next) => {
  // Agar custom AppError use kia to wo isOperational hoga
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: err.status || "error",
    message: err.message || "Something went wrong",
  });
};

export default errorMiddleware;
