class ApiResponse {
    constructor(
        statusCode,                   // The HTTP status code (e.g., 200, 201, 404, 500)
        data,                         // The actual response data (payload) returned to the client
        message = "Success"           // A user-friendly message (default is "Success")
    ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        
        // If statusCode is below 400, it means the operation was successful.
        // Status codes 400 and above represent errors.
        this.success = statusCode < 400 
    }
}

export { ApiResponse }
