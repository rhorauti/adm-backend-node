import { EmployeeController } from '@controllers/employee/employee.controller';
import { ICompanyParams } from '@core/interfaces/company.interface';
import Router, { NextFunction, Request, Response } from 'express';
import { param, ValidationChain } from 'express-validator';
import { container } from 'tsyringe';

const employeeRoute = Router();

const employeeController = container.resolve(EmployeeController);

const employeeParamsMiddleware = (): ValidationChain[] => {
  return [param('idCompany').notEmpty().withMessage('O parâmetro idCompany não pode estar vazio.')];
};

employeeRoute.get(
  '/employees/:idCompany',
  employeeParamsMiddleware(),
  (request: Request<ICompanyParams>, response: Response, next: NextFunction) => {
    employeeController.getEmployeeList(request, response, next);
  },
);

export { employeeRoute };
