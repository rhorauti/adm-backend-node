import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { Task } from '@models/task/task.model';
import { TaskFakeController } from '@controllers/task/task-fale.controllert';

const taskFakeRoute = Router();

const baseRouteName = 'tasks-fake';
export const keyId: keyof Task = 'idTask';
const deptName = 'department';

const controller = container.resolve(TaskFakeController);

taskFakeRoute.get(
  `/:${deptName}/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataList(request, response, next);
  },
);

taskFakeRoute.get(
  `/:${deptName}/${baseRouteName}/:${String(keyId)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

taskFakeRoute.post(
  `/:${deptName}/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

taskFakeRoute.delete(
  `/:${deptName}/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { taskFakeRoute };
