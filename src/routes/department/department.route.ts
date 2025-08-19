import { DepartmentController } from '@controllers/department/department.controller';
import Router, { NextFunction, Request, Response } from 'express';
import { param, ValidationChain } from 'express-validator';
import { container } from 'tsyringe';

const departmentRoute = Router();

const departmentController = container.resolve(DepartmentController);

const departmentParamsMiddleware = (): ValidationChain[] => {
  return [
    param('idDepartment').notEmpty().withMessage('O parâmetro idDepartment não pode estar vazio.'),
  ];
};

departmentRoute.get(
  '/departments/:idDepartment',
  departmentParamsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    departmentController.getDepartment(request, response, next);
  },
);

departmentRoute.get('/departments', (request: Request, response: Response, next: NextFunction) => {
  departmentController.getDepartmentList(request, response, next);
});

departmentRoute.post('/departments', (request: Request, response: Response, next: NextFunction) => {
  departmentController.saveDepartment(request, response, next);
});

departmentRoute.delete(
  '/departments',
  (request: Request, response: Response, next: NextFunction) => {
    departmentController.deleteDepartment(request, response, next);
  },
);

export { departmentRoute };
