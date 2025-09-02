import Router, { NextFunction, Request, Response } from 'express';
import { param, ValidationChain } from 'express-validator';
import { container } from 'tsyringe';
import { raiseMiddlewareError } from '@utils/misc';
import { EmployeeRepository } from '@repositories/employee/employee.repository';

const employeeRoute = Router();

const route = 'employees';
const idKey = 'idEmployee';

const controller = container.resolve(EmployeeRepository);

const paramsMiddleware = (): ValidationChain[] => {
  return [
    param(`${String(idKey)}`)
      .notEmpty()
      .withMessage(`O parâmetro ${String(idKey)} não pode estar vazio.`),
  ];
};

employeeRoute.get(
  `/${route}/:${String(idKey)}`,
  paramsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },

  (request: Request, response: Response, next: NextFunction) => {
    // controller.getData(request, response, next);
  },
);

employeeRoute.get(`/${route}`, (request: Request, response: Response, next: NextFunction) => {
  // controller.getDataListWithRelation(request, response, next);
});

employeeRoute.post(`/${route}`, (request: Request, response: Response, next: NextFunction) => {
  // controller.save(request, response, next);
});

employeeRoute.delete(
  `/${route}/:${String(idKey)}`,
  paramsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    // controller.delete(request, response, next);
  },
);

export { employeeRoute };
