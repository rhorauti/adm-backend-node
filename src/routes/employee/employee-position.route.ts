import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { EmployeePositionController } from '@controllers/employee/employee-position.controller';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { body } from 'express-validator';
import { raiseMiddlewareError } from '@utils/misc';

const employeePositionRoute = Router();

const baseRouteName = 'employee-positions';
export const keyId: keyof EmployeePosition = 'idEmployeePosition';

const controller = container.resolve(EmployeePositionController);

const bodyValidationMiddleware = () => {
  return [body('name').notEmpty().withMessage('O campo Nome do Cargo não pode estar vazio!')];
};

employeePositionRoute.get(
  `/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataList(request, response, next);
  },
);

employeePositionRoute.get(
  `/${baseRouteName}/:${String(keyId)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

employeePositionRoute.post(
  `/${baseRouteName}`,
  bodyValidationMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

employeePositionRoute.delete(
  `/${baseRouteName}/:${String(keyId)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { employeePositionRoute };
