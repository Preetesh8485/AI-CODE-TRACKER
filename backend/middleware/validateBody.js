import ErrorHandler from "./errorMiddleware.js";

export const validateBody = (req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
        if (!req.body || Object.keys(req.body).length === 0) {
            req.body = {};
        }
    }
    next();
};