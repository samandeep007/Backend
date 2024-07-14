// to be used in the controllers to send standardized responses to the client

class ApiResponse {
  constructor(statusCode, data, message  = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
