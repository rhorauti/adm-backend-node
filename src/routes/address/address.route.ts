import { AddressController } from '@controllers/address/address.controller';
import { ICompanyParams } from '@core/interfaces/company.interface';
import Router, { NextFunction, Request, Response } from 'express';
import { param, ValidationChain } from 'express-validator';
import { container } from 'tsyringe';

const addressRoute = Router();

const addressParamsMiddleware = (): ValidationChain[] => {
  return [param('idCompany').notEmpty().withMessage('O parâmetro idCompany não pode estar vazio.')];
};

const addressController = container.resolve(AddressController);

addressRoute.get(
  '/addresses/:idCompany',
  addressParamsMiddleware(),
  (request: Request<ICompanyParams>, response: Response, next: NextFunction) => {
    addressController.getAddressList(request, response, next);
  },
);

export { addressRoute };
