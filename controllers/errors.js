class ValidationError extends Error {
  constructor(field, message) {
    super(`Invalid ${field || "field"} : ${message}`);
    this.message = message
      ? `Invalid ${field} : ${message}`
      : `Invalid ${field}`;
    this.field = field;
    this.name = this.constructor.name;
    this.httpCode = 400;
  }
}

class NotActiveError extends Error {
  constructor(resource) {
    super(resource + " is not active");
    this.name = this.constructor.name;
    this.httpCode = 403;
  }
}

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message ? "Not Authorized: " + message : "Not Authorized");
    this.name = this.constructor.name;
    this.httpCode = 401;
  }
}

class NotUniqueError extends Error {
  constructor(field) {
    super(`${field} already exists`);
    this.field = field;
    this.name = this.constructor.name;
    this.httpCode = 409;
  }
}

class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} not found`);
    this.resource = resource;
    this.name = this.constructor.name;
    this.httpCode = 404;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(
      message
        ? message
        : "Oops something's wrong with the server. We're working on a fix. "
    );
    this.name = this.constructor.name;
    this.httpCode = 500;
  }
}

async function getError(err) {
  if (err) {
    let firstError;
    let errorName = err.name;
    if (err.errors) {
      firstError = err.errors[Object.keys(err.errors)[0]];
      errorName = firstError.name;
    } else {
      firstError = err;
    }
    switch (errorName) {
      case "NotActiveError":
      case "ValidationError":
      case "NotFoundError":
      case "NotAuthorizedError":
        return err;
      case "CastError":
        return new ValidationError(
          firstError["$originalErrorPath"] || firstError.path
        );
      case "ValidatorError":
        return new ValidationError(
          firstError.properties.path,
          firstError.properties.message
        );
      case "MongoError":
        return new NotUniqueError(Object.keys(err.keyValue)[0]);
      case "JwtParseError":
        return new NotAuthorizedError("Invalid token");
      default:
        console.log(err);
        return new ServerError();
    }
  }
  console.log(err);
  return new ServerError();
}

module.exports = {
  ValidationError,
  NotFoundError,
  NotAuthorizedError,
  NotUniqueError,
  NotActiveError,
  getError,
};
