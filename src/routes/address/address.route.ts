import { AddressController } from '@controllers/address/address.controller';
import { ICompanyParams } from '@core/interfaces/company.interface';
import { raiseMiddlewareError } from '@utils/misc';
import Router, { NextFunction, Request, Response } from 'express';
import { param, ValidationChain } from 'express-validator';
import { container } from 'tsyringe';

const addressRoute = Router();

const addressParamsMiddleware = (): ValidationChain[] => {
  return [
    param(idCompany).notEmpty().withMessage(`O parâmetro ${idCompany} não pode estar vazio.`),
  ];
};

const addressController = container.resolve(AddressController);
const route = 'addresses';
const idCompany = 'idCompany';

addressRoute.get(
  `/${route}/:${idCompany}`,
  addressParamsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request<ICompanyParams>, response: Response, next: NextFunction) => {
    addressController.getDataList(request, response, next);
  },
);

export { addressRoute };
