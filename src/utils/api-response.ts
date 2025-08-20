import { Response } from 'express';
import { injectable } from 'tsyringe';
import { dateAndHourFormatted } from './misc';

@injectable()
export class ApiResponse {
  Ok<T>(response: Response, statusCode: number = 200, message: string, data?: T) {
    return response.status(statusCode).json({
      date: dateAndHourFormatted(new Date()),
      status: true,
      message: message,
      data: data,
    });
  }

  Error(response: Response, statusCode: number = 500, message: string, errors?: null) {
    return response.status(statusCode).json({
      date: dateAndHourFormatted(new Date()),
      status: false,
      message: message,
      errors: errors,
    });
  }
}
