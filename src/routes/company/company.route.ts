import { CompanyController } from '@controllers/company/company.controller';
import { ICompany, ICompanyRegister, ICompanyResponse } from '@core/interfaces/company.interface';
import { ApiResponse } from '@utils/api-response';
import Router, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { container } from 'tsyringe';

const companyRoute = Router();

const companyController = container.resolve(CompanyController);
const apiResponse = container.resolve(ApiResponse);

const companyMiddleware = () => {
  return [
    body('company.nickname').notEmpty().withMessage('O campo razão social não pode estar vazio!'),
    body('company.name').notEmpty().withMessage('O campo nome da empresa não pode estar vazio!'),
    body('company.cnpj').notEmpty().withMessage('O campo CNPJ não pode estar vazio!'),
  ];
};

companyRoute.get(
  '/companies',
  (request: Request<ICompany>, response: Response<ICompanyResponse>, next: NextFunction) => {
    companyController.getCompanyList(request, response, next);
  },
);

companyRoute.post(
  '/companies',
  companyMiddleware(),
  (
    request: Request<ICompanyRegister>,
    response: Response<ICompanyResponse>,
    next: NextFunction,
  ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const firstErrorMessage = errors.array()[0].msg;
      return apiResponse.Error(response, 401, firstErrorMessage);
    }
    next();
  },
  (
    request: Request<ICompanyRegister>,
    response: Response<ICompanyResponse>,
    next: NextFunction,
  ) => {
    companyController.saveCompany(request, response, next);
  },
);

companyRoute.get(
  '/companies/:idCompany',
  (request: Request, response: Response, next: NextFunction) => {
    companyController.getCompanyInfo(request, response, next);
  },
);

companyRoute.get(
  '/companies/detail/:idCompany',
  (request: Request, response: Response, next: NextFunction) => {
    companyController.getCompanyCompleteInfo(request, response, next);
  },
);

companyRoute.delete(
  '/companies/:idCompany',
  (request: Request, response: Response<ICompanyResponse>, next: NextFunction) => {
    companyController.deleteCompany(request, response, next);
  },
);

companyRoute.post(
  '/companies/test/add',
  (request: Request, response: Response, next: NextFunction) => {
    companyController.addRandomRegisters(request, response, next);
  },
);

companyRoute.delete(
  '/companies/test/delete',
  (request: Request, response: Response, next: NextFunction) => {
    companyController.deleteAllRandomRegisters(request, response, next);
  },
);

export { companyRoute };
