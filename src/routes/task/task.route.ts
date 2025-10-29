import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { raiseMiddlewareError } from '@utils/misc';
import { Task } from '@models/task/task.model';
import { TaskController } from '@controllers/task/task.controller';
import { CloudStorage } from 'GCP/cloud-storage.gcp';

const taskRoute = Router();

const baseRouteName = 'tasks';
const idDepartment = 'idDepartment';
export const keyId: keyof Task = 'idTask';

const cloudStorage = container.resolve(CloudStorage);
const controller = container.resolve(TaskController);

taskRoute.get(
  `/:${idDepartment}/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataList(request, response, next);
  },
);

taskRoute.get(
  `/:${idDepartment}/${baseRouteName}/:${String(keyId)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

taskRoute.post(
  `/:${idDepartment}/${baseRouteName}`,
  cloudStorage.upload.array('files'),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

taskRoute.delete(
  `/:${idDepartment}/${baseRouteName}/:${String(keyId)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { taskRoute };
