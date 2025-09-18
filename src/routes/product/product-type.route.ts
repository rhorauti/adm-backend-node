import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { body } from 'express-validator';
import { raiseMiddlewareError } from '@utils/misc';
import { ProductTypeController } from '@controllers/product/product-types.controller';

const productTypeRoute = Router();

const baseRouteName = 'product-types';
const idKey = 'idProductType';

const controller = container.resolve(ProductTypeController);

const bodyValidationMiddleware = () => {
  return [body('name').notEmpty().withMessage('O campo de tipo de produtos não pode estar vazio!')];
};

productTypeRoute.get(
  `/${baseRouteName}/:${String(idKey)}`,

  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

productTypeRoute.get(
  `/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataList(request, response, next);
  },
);

productTypeRoute.post(
  `/${baseRouteName}`,
  bodyValidationMiddleware(),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

productTypeRoute.delete(
  `/${baseRouteName}/:${String(idKey)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { productTypeRoute };
