// asyncHandler is a higher-order function.
// It takes a controller function (requestHandler) and wraps it.
// This allows us to automatically catch errors from async/await
// without writing try/catch manually in every route.
const asyncHandler = (requestHandler) => {

    // This returned function is the actual Express route handler.
    // It receives (req, res, next) just like any normal controller.
    return (req, res, next) => {

        // Promise.resolve() converts the result of requestHandler into a Promise.
        // Why? Because:
        // - If requestHandler is async → it already returns a Promise.
        // - If requestHandler is not async → this still wraps it in a Promise.
        // This ensures .catch() will ALWAYS work, no matter what.
        Promise.resolve(requestHandler(req, res, next))

            // If any error occurs inside requestHandler (including from async/await),
            // .catch() will capture that error and pass it to next(err).
            // next(err) → forwards the error to Express's global error-handling middleware.
            // NOTE: ApiError does NOT send errors itself — asyncHandler does.
            .catch((err) => next(err));
    };
};

export default asyncHandler;
