import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { body } from 'express-validator';
import { raiseMiddlewareError } from '@utils/misc';
import { UnitController } from '@controllers/unit/unit.controller';

const unitRoute = Router();

const baseRouteName = 'units';
const idKey = 'idUnit';

const controller = container.resolve(UnitController);

const bodyValidationMiddleware = () => {
  return [body('name').notEmpty().withMessage('O campo de unidade não pode estar vazio!')];
};

unitRoute.get(
  `/${baseRouteName}/:${String(idKey)}`,

  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

unitRoute.get(`/${baseRouteName}`, (request: Request, response: Response, next: NextFunction) => {
  controller.getDataList(request, response, next);
});

unitRoute.post(
  `/${baseRouteName}`,
  bodyValidationMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

unitRoute.delete(
  `/${baseRouteName}/:${String(idKey)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { unitRoute };
