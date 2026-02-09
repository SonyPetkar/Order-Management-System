export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid JWT token';
    return res.status(401).json({
      success: false,
      message,
    });
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'JWT token has expired';
    return res.status(401).json({
      success: false,
      message,
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return res.status(409).json({
      success: false,
      message,
    });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
