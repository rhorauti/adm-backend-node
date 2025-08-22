import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { container } from 'tsyringe';
import { ApiResponse } from './api-response';

export const emptyStringToNull = (obj: Record<string, any>): void => {
  Object.entries(obj).forEach(([key, value]) => {
    if ((typeof obj[key] === 'string' || typeof obj[key] === 'undefined') && value.trim() === '') {
      obj[key] = null;
    }
  });
};

type DateFormat = 'short' | 'long' | 'medium' | 'full';

const countrySetup = 'pt-BR';

export const dateAndHourFormatted = (
  dateAndHour: Date,
  dateFormat: DateFormat = 'short',
  timeFormat: DateFormat = 'short',
): string => {
  return new Intl.DateTimeFormat(countrySetup, {
    dateStyle: dateFormat,
    timeStyle: timeFormat,
  }).format(dateAndHour);
};

export const raiseMiddlewareError = (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const apiResponse = container.resolve(ApiResponse);
    const firstErrorMessage = errors.array()[0].msg;
    return apiResponse.Error(response, 401, firstErrorMessage);
  }
  next();
};
