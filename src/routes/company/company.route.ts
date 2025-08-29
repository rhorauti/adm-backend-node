import { CompanyController } from '@controllers/company/company.controller';
import { ICompanyDetail, ICompanyResponse } from '@core/interfaces/company.interface';
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
    body('company.nickname').notEmpty().withMessage('O campo razão social não pode estar vazio!'),
    body('company.name').notEmpty().withMessage('O campo nome da empresa não pode estar vazio!'),
    body('company.cnpj').notEmpty().withMessage('O campo CNPJ não pode estar vazio!'),
  ];
};

companyRoute.get(`/${route}`, (request: Request, response: Response, next: NextFunction) => {
  companyController.getCompanyList(request, response, next);
});

companyRoute.post(
  `/${route}`,
  companyMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    companyController.saveCompany(request, response, next);
  },
);

companyRoute.get(`/${route}/:${id}`, (request: Request, response: Response, next: NextFunction) => {
  companyController.getCompanyInfo(request, response, next);
});

companyRoute.get(
  `/${route}/detail/:${id}`,
  (request: Request, response: Response, next: NextFunction) => {
    companyController.getCompanyCompleteInfo(request, response, next);
  },
);

companyRoute.delete(
  `/${route}/:${id}`,
  (request: Request, response: Response<ICompanyResponse>, next: NextFunction) => {
    companyController.deleteCompany(request, response, next);
  },
);

export { companyRoute };
