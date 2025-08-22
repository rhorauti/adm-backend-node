import { CompanyController } from '@controllers/company/company.controller';
import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

const companyFakeRoute = Router();
const companyController = container.resolve(CompanyController);
const route = 'companies';

companyFakeRoute.post(
  `/${route}/fake/add`,
  (request: Request, response: Response, next: NextFunction) => {
    companyController.addRandomRegisters(request, response, next);
  },
);

companyFakeRoute.delete(
  `/${route}/fake/delete`,
  (request: Request, response: Response, next: NextFunction) => {
    companyController.deleteAllRandomRegisters(request, response, next);
  },
);

export { companyFakeRoute };
