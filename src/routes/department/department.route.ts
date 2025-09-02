import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { DepartmentController } from '@controllers/department/department.controller';

const departmentRoute = Router();

const baseRouteName = 'departments';
const idKey = 'idDepartment';

const controller = container.resolve(DepartmentController);

departmentRoute.get(
  `/${baseRouteName}/:${String(idKey)}`,

  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataByField(request, response, next);
  },
);

departmentRoute.get(
  `/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

departmentRoute.post(
  `/${baseRouteName}`,
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
