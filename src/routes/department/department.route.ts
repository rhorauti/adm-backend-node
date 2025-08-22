import { DepartmentController } from '@controllers/department/department.controller';
import Router, { NextFunction, Request, Response } from 'express';
import { param, ValidationChain } from 'express-validator';
import { container } from 'tsyringe';
import { raiseMiddlewareError } from '@utils/misc';

const departmentRoute = Router();

const departmentController = container.resolve(DepartmentController);
const route = 'departments';
const id = 'idDepartment';

const paramsMiddleware = (): ValidationChain[] => {
  return [param(`${id}`).notEmpty().withMessage(`O parâmetro ${id} não pode estar vazio.`)];
};

departmentRoute.get(
  `/${route}/:${id}`,
  paramsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },

  (request: Request, response: Response, next: NextFunction) => {
    departmentController.getData(request, response, next);
  },
);

departmentRoute.get(`/${route}`, (request: Request, response: Response, next: NextFunction) => {
  departmentController.getDataList(request, response, next);
});

departmentRoute.post(`/${route}`, (request: Request, response: Response, next: NextFunction) => {
  departmentController.save(request, response, next);
});

departmentRoute.delete(
  `/${route}/:${id}`,
  paramsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    departmentController.delete(request, response, next);
  },
);

export { departmentRoute };
