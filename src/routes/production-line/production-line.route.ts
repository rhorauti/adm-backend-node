import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { body } from 'express-validator';
import { raiseMiddlewareError } from '@utils/misc';
import { ProductionLineController } from '@controllers/production-line/production-line.controller';

const productionLineRoute = Router();

const baseRouteName = 'production-lines';
const idKey = 'idProductionLine';

const controller = container.resolve(ProductionLineController);

const bodyValidationMiddleware = () => {
  return [
    body('lineCode').notEmpty().withMessage('O campo de Código da Linha não pode estar vazio!'),
  ];
};

productionLineRoute.get(
  `/${baseRouteName}/:${String(idKey)}`,

  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

productionLineRoute.get(
  `/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataList(request, response, next);
  },
);

productionLineRoute.post(
  `/${baseRouteName}`,
  bodyValidationMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

productionLineRoute.delete(
  `/${baseRouteName}/:${String(idKey)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { productionLineRoute };
