const AppError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    error.isOperational = true;

    Error.capturesStackTrace(error, AppError);
    return error;
}

export default AppError;