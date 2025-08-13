import { EmployeeController } from '@controllers/employee/employee.controller';
import Router, { Request, Response } from 'express';
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
  (request: Request, response: Response) => {
    employeeController.getEmployee(request, response);
  },
);

employeeRoute.post('employees/position', (request: Request, response: Response) => {});

export { employeeRoute };
