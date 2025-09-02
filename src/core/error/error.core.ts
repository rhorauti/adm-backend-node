export class CustomErrorHandler extends Error {
  public statusCode: number;
  public step?: string;

  constructor(message: string, statusCode: number, step?: string) {
    super(message);
    this.statusCode = statusCode;
    this.step = step;
    Object.setPrototypeOf(this, CustomErrorHandler.prototype);
  }
}
