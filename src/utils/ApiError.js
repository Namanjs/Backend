class ApiError extends Error { 
    // We are creating a custom error class (ApiError) that extends the built-in Error class.
    // This lets us add our own properties and structure to errors we throw in our application.

    constructor( 
        statusCode,                     // HTTP status code (e.g., 400, 404, 500)
        message = "Something went Wrong.", // Human readable error message (default if none provided)
        errors = [],                    // Optional array of error details (useful for validations)
        stack = ""                      // Optional stack trace override
    ){
        super(message) 
        // super(message) calls the parent Error class constructor
        // so our ApiError still works like a normal JS Error (message, name, etc.)

        this.statusCode = statusCode
        this.data = null // fixed value (not set dynamically here)
        this.message = message
        this.success = false // always false because errors indicate failure
        this.errors = errors

        // stack = a trail of where the error happened in the code,
        // helps developers locate the exact place and sequence of function calls.
        if(stack){
            this.stack = stack // if caller provides a custom stack, use it.
        } else {
            // Otherwise, automatically generate a stack trace for this error.
            // Argument 1: attach the stack trace to *this* error instance.
            // Argument 2: hide the constructor of ApiError from the stack trace
            // so the trace starts where the error actually happened → cleaner debugging.
            Error.captureStackTrace(this, this.constructor) 
        }
    }
}

export { ApiError }
