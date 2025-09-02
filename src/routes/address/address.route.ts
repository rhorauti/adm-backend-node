import { AddressController } from '@controllers/address/address.controller';
import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

const addressRoute = Router();

const addressController = container.resolve(AddressController);
const route = 'addresses';
const idCompany = 'idCompany';

addressRoute.get(
  `/${route}/:${idCompany}`,
  (request: Request, response: Response, next: NextFunction) => {
    addressController.getDataList(request, response, next);
  },
);

export { addressRoute };
