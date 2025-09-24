import { TOKENS } from '@containers/symbol';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

export interface CustomError extends Error {
  statusCode?: number;
  step?: string;
}

const apiResponse = container.resolve<ApiResponse>(TOKENS.ApiResponse);

export const handleErrorMiddleware = async (
  error: CustomError,
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response> => {
  console.log('error middleware', error);
  if (!error.statusCode) error.statusCode = 500;
  if (!error.message) error.message = 'Erro interno do servidor';
  return apiResponse.Error(response, 500, error.message);
};
