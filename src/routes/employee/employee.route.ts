import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { body } from 'express-validator';
import { raiseMiddlewareError } from '@utils/misc';
import { EmployeeController } from '@controllers/employee/employee.controller';
import { Employee } from '@models/employee/employee.model';
import { CloudStorage } from 'GCP/cloud-storage.gcp';

const employeeRoute = Router();

const baseRouteName = 'employees';
export const keyId: keyof Employee = 'idEmployee';

const controller = container.resolve(EmployeeController);
const cloudStorage = container.resolve(CloudStorage);

const bodyValidationMiddleware = () => {
  return [body('name').notEmpty().withMessage('O campo Nome do funcionário não pode estar vazio!')];
};

employeeRoute.get(
  `/:idCompany/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataList(request, response, next);
  },
);

employeeRoute.get(
  `/:idCompany/${baseRouteName}/:${String(keyId)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

employeeRoute.post(
  `/:idCompany/${baseRouteName}`,
  // bodyValidationMiddleware(),
  cloudStorage.upload.single('file'),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

employeeRoute.delete(
  `/:idCompany/${baseRouteName}/:${String(keyId)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { employeeRoute };
