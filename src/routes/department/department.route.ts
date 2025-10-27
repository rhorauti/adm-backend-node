import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { DepartmentController } from '@controllers/department/department.controller';
import { body } from 'express-validator';
import { raiseMiddlewareError } from '@utils/misc';

const departmentRoute = Router();

const baseRouteName = 'departments';
const idKey = 'idDepartment';

const controller = container.resolve(DepartmentController);

const bodyValidationMiddleware = () => {
  return [body('name').notEmpty().withMessage('O campo de departamento não pode estar vazio!')];
};

departmentRoute.get(
  `/${baseRouteName}/:${String(idKey)}`,

  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataByField(request, response, next);
  },
);

departmentRoute.get(
  `/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataList(request, response, next);
  },
);

departmentRoute.post(
  `/${baseRouteName}`,
  bodyValidationMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

departmentRoute.delete(
  `/${baseRouteName}/:${String(idKey)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { departmentRoute };
