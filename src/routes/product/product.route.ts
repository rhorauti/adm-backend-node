import Router, { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { body } from 'express-validator';
import { raiseMiddlewareError } from '@utils/misc';
import { ProductController } from '@controllers/product/product.controller';
import { CloudStorage } from 'GCP/cloud-storage.gcp';

const productRoute = Router();

const baseRouteName = 'products';
const idKey = 'idProduct';

const controller = container.resolve(ProductController);
const cloudStorage = container.resolve(CloudStorage);

const bodyValidationMiddleware = () => {
  return [
    body('data.name').notEmpty().withMessage('O campo nome não pode estar vazio!'),
    body('data.origin').notEmpty().withMessage('O campo origem não pode estar vazio.'),
    body('data.idUnit').notEmpty().withMessage('O campo idUnit não pode estar vazio.'),
    body('data.idProductType')
      .notEmpty()
      .withMessage('O campo idProductType não pode estar vazio.'),
    body('data.internalPartNumber')
      .notEmpty()
      .withMessage('O campo PN interno não pode estar vazio.'),
  ];
};

productRoute.get(
  `/${baseRouteName}/:${String(idKey)}`,

  (request: Request, response: Response, next: NextFunction) => {
    controller.getData(request, response, next);
  },
);

productRoute.get(
  `/${baseRouteName}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.getDataList(request, response, next);
  },
);

productRoute.post(
  `/${baseRouteName}`,
  // bodyValidationMiddleware(),
  cloudStorage.upload.single('file'),
  (request: Request, response: Response, next: NextFunction) => {
    raiseMiddlewareError(request, response, next);
  },
  (request: Request, response: Response, next: NextFunction) => {
    controller.save(request, response, next);
  },
);

productRoute.delete(
  `/${baseRouteName}/:${String(idKey)}`,
  (request: Request, response: Response, next: NextFunction) => {
    controller.delete(request, response, next);
  },
);

export { productRoute };
