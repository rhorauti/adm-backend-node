import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { container } from 'tsyringe';
import { ApiResponse } from './api-response';

export const emptyStringToNull = (obj: Record<string, any>): void => {
  for (const key in obj) {
    const value = obj[key];
    if (
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'number' && value === 0)
    ) {
      obj[key] = null;
    }
  }
};

export const emptyToNullRecursive = (obj: Record<string, any>): void => {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const value = obj[key];
    if (typeof value == 'object' && value != null) {
      emptyToNullRecursive(value);
    }
    if (
      (typeof value == 'string' && value.trim() == '') ||
      (typeof value == 'number' && value == 0)
    ) {
      obj[key] = null;
    }
  }
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
    return apiResponse.Error(response, 400, firstErrorMessage);
  }
  next();
};

export const translateDeptName = (deptName: string): string => {
  switch (deptName.toLowerCase().trim()) {
    case 'maintenance': {
      return 'Manutenção';
    }
    case 'purchasing': {
      return 'Compras';
    }
    case 'pc': {
      return 'PCP';
    }
    case 'sales': {
      return 'Vendas';
    }
    case 'project': {
      return 'Projetos';
    }
    case 'finance': {
      return 'Financeiro';
    }
    case 'quality': {
      return 'Qualidade';
    }
    case 'hr': {
      return 'RH';
    }
  }
  return '';
};

export const setDeptNameTranslationToDefaultName = (deptName: string): string => {
  switch (deptName.toLowerCase().trim()) {
    case 'manutenção': {
      return 'maintenance';
    }
    case 'compras': {
      return 'purchasing';
    }
    case 'pcp': {
      return 'pc';
    }
    case 'vendas': {
      return 'sales';
    }
    case 'projetos': {
      return 'project';
    }
    case 'financeiro': {
      return 'finance';
    }
    case 'qualidade': {
      return 'quality';
    }
    case 'rh': {
      return 'hr';
    }
  }
  return '';
};
