import Router, { NextFunction, Request, Response } from 'express';
import { param, ValidationChain } from 'express-validator';
import { container } from 'tsyringe';
import { raiseMiddlewareError } from '@utils/misc';
import { TaskType } from '@models/task/task-type.model';
import { TaskTypeController } from '@controllers/task/task-type.controller';

const taskTypeRoute = Router();

const baseRouteName = 'task-types';
const deptName = 'department';
export const keyId: keyof TaskType = 'idTaskType';

const controller = container.resolve(TaskTypeController);

const paramsMiddleware = (): ValidationChain[] => {
  return [
    param(`${String(keyId)}`)
      .notEmpty()
      .withMessage(`O parâmetro ${String(keyId)} não pode estar vazio.`),
  ];
};

taskTypeRoute.get(
  `/:${deptName}/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataList(request, response, next);
  },
);

taskTypeRoute.get(
  `/:${deptName}/${baseRouteName}/:${String(keyId)}`,
  paramsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },

  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

taskTypeRoute.post(
  `/:${deptName}/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

taskTypeRoute.delete(
  `/:${deptName}/${baseRouteName}/:${String(keyId)}`,
  paramsMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { taskTypeRoute };
