import { CompanyController, DeleteCompanyParams } from '@controllers/company/company.controller';
import {
  ICompany,
  ICompanyRegister,
  IResponseCompany,
} from '@src/core/interfaces/company.interface';
import Router, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { container } from 'tsyringe';

const companyRoute = Router();

const companyController = container.resolve(CompanyController);

const createBodyChain = () => {
  return [
    body('company.type').notEmpty().isNumeric().withMessage('Informe um valor válido!'),
    body('company.nickname').notEmpty().withMessage('O campo nickname não pode estar vazio!'),
    body('company.name').notEmpty().withMessage('O campo nome da empresa não pode estar vazio!'),
    body('company.cnpj').notEmpty().withMessage('O campo CNPJ não pode estar vazio!'),
  ];
};

companyRoute.get(
  '/companies',
  (request: Request<ICompany>, response: Response<IResponseCompany>, next: NextFunction) => {
    companyController.getCompanyList(request, response, next);
  },
);

companyRoute.post(
  '/companies',
  createBodyChain(),
  (
    request: Request<ICompanyRegister>,
    response: Response<IResponseCompany>,
    next: NextFunction,
  ) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      const firstErrorMessage = errors.array()[0].msg;
      return response
        .status(400)
        .json({ date: new Date().toString(), status: false, msg: firstErrorMessage });
    }
    next();
  },
  (
    request: Request<ICompanyRegister>,
    response: Response<IResponseCompany>,
    next: NextFunction,
  ) => {
    console.log('body', request.body);
    companyController.saveCompany(request, response, next);
  },
);

companyRoute.delete(
  '/companies/:idCompany',
  (
    request: Request<DeleteCompanyParams>,
    response: Response<IResponseCompany>,
    next: NextFunction,
  ) => {
    companyController.deleteCompany(request, response, next);
  },
);

export { companyRoute };
