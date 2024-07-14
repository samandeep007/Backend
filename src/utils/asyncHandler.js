// A utility function to handle async functions in express route handlers

const asyncHandler = (requestHandler) => {
    return(req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    }
}

export {asyncHandler}