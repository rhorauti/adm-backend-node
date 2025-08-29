import Router, { NextFunction, Request, Response } from 'express';
import { param, ValidationChain } from 'express-validator';
import { container } from 'tsyringe';
import { raiseMiddlewareError } from '@utils/misc';
// import { Employee } from '@models/employee/employee.model';
import { EmployeeRepository } from '@repositories/employee/employee.repository';
// import { BASE_CONTROLLER_FACTORY } from '@containers/tokens';
// import { BaseControllerFactory } from '@containers/index';
// import { MergedDataType, RelatedEntityProps } from '@core/types/base.type';
// import { Employee } from '@models/employee/employee.model';

const employeeRoute = Router();

const route = 'employees';
const idKey = 'idEmployee';
// const routeTranslated = 'Funcionários';
// const entityRelated: RelatedEntityProps = 'company';
// const idKeyRelated: keyof MergedDataType | null = 'idCompany';

// const makeController = container.resolve<BaseControllerFactory>(BASE_CONTROLLER_FACTORY);
// const employeeController = makeController<Employee, 'idEmployee'>({
//   entity: Employee,
//   idKey: idKey,
//   parseId: raw => Number(raw) as Employee['idEmployee'],
//   routeTranslated: routeTranslated,
//   entityRelated: entityRelated,
//   idKeyRelated: idKeyRelated,
// });

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
