// Standard success response
const successResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        statusCode,
        error: null,
        message,
        data
    });
};

// Standard error response
const errorResponse = (res, statusCode, message, error = null) => {
    return res.status(statusCode).json({
        statusCode,
        error: error ? error.toString() : null,
        message,
        data: null
    });
};

module.exports = {
    successResponse,
    errorResponse
};
