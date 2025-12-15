export class AppErrors extends Error {
  constructor(errorType) {
    super(errorType.message);
    this.httpStatus = errorType.httpStatus;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

