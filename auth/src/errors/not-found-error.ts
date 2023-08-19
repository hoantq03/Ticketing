import { CustomError } from "./custom-errors";

export class NotFoundError extends CustomError {
  statusCode = 404;
  reason: string = "This resource not found";
  constructor() {
    super("This resource not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
