import { EmployeeController } from '@controllers/employee/employee.controller';
import { raiseMiddlewareError } from '@utils/misc';
import Router, { NextFunction, Request, Response } from 'express';
import { param, ValidationChain } from 'express-validator';
import { container } from 'tsyringe';

const employeeRoute = Router();

const employeeController = container.resolve(EmployeeController);
const routeEmployee = 'employees';
const idCompany = 'idCompany';

const companyParamsMiddleware = (): ValidationChain[] => {
  return [
    param(`${idCompany}`).notEmpty().withMessage(`O parâmetro ${idCompany} não pode estar vazio.`),
  ];
};

employeeRoute.get(
  `/${routeEmployee}/:${idCompany}`,
  companyParamsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response) => {
    employeeController.getEmployee(request, response);
  },
);

const routeEmployeePosition = 'employee-positions';
const idEmployeePosition = 'idEmployeePosition';

const employeePositionParamsMiddleware = (): ValidationChain[] => {
  return [
    param(`${idEmployeePosition}`)
      .notEmpty()
      .withMessage(`O parâmetro ${idEmployeePosition} não pode estar vazio.`),
  ];
};

employeeRoute.get(
  `/${routeEmployeePosition}`,
  (request: Request, response: Response, next: NextFunction) => {
    employeeController.getEmployeePositionList(request, response, next);
  },
);

employeeRoute.get(
  `/${routeEmployeePosition}/:${idEmployeePosition}`,
  employeePositionParamsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    employeeController.getEmployeePosition(request, response, next);
  },
);

employeeRoute.post(
  `/${routeEmployeePosition}`,
  (request: Request, response: Response, next: NextFunction) => {
    employeeController.saveEmployeePosition(request, response, next);
  },
);

employeeRoute.delete(
  `/${routeEmployeePosition}/:${idEmployeePosition}`,
  employeePositionParamsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    console.log('route', request.params);
    employeeController.deleteEmployeePosition(request, response, next);
  },
);

export { employeeRoute };
