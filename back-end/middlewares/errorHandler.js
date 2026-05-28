/**
 * Global error handling middleware.
 */
export const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.stack}`);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong.'
    });
};
