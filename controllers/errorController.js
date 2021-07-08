const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDupField = (err) => {
  const message = `Duplicate field : ${err.keyValue.name}. Please change this field`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired, Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  console.error(err);
  return res.status(err.statusCode).render('error', {
    title: 'Somrthing went wrong!',
    msg: err.message,
  });
};

sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error(err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Somrthing went wrong!',
      msg: err.message,
    });
  }
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.message.includes('Cast')) error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDupField(error);
    if (error._message === 'Tour validation failed')
      error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
