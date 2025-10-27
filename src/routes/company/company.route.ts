import { CompanyController } from '@controllers/company/company.controller';
import { IResponseCompanyForm } from '@core/interfaces/company.interface';
import { raiseMiddlewareError } from '@utils/misc';
import Router, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { container } from 'tsyringe';

const companyRoute = Router();
const companyController = container.resolve(CompanyController);
const route = 'companies';
const id = 'idCompany';

const companyMiddleware = () => {
  return [
    body('nickname').notEmpty().withMessage('O campo razão social não pode estar vazio!'),
    body('name').notEmpty().withMessage('O campo nome da empresa não pode estar vazio!'),
    body('cnpj').notEmpty().withMessage('O campo CNPJ não pode estar vazio!'),
  ];
};

companyRoute.get(`/${route}`, (request: Request, response: Response, next: NextFunction) => {
  companyController.getDataList(request, response, next);
});

companyRoute.post(
  `/${route}`,
  companyMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    companyController.save(request, response, next);
  },
);

companyRoute.get(`/${route}/:${id}`, (request: Request, response: Response, next: NextFunction) => {
  companyController.getData(request, response, next);
});

companyRoute.delete(
  `/${route}/:${id}`,
  (request: Request, response: Response<IResponseCompanyForm>, next: NextFunction) => {
    companyController.delete(request, response, next);
  },
);

export { companyRoute };
