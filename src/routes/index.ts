import { AuthController } from '@controllers/auth.controller';
import { CompanyController } from '@controllers/company.controller';
import { NextFunction, Router } from 'express';
import { container } from 'tsyringe';

const router = Router();

const authController = container.resolve(AuthController);
const companyController = container.resolve(CompanyController);

router.post('/login', (request, response) => {
  authController.loginUser(request, response);
});

router.post('/signup', (request, response) => {
  authController.createNewUser(request, response);
});

router.get('/email-validation', (request, response) => {
  authController.confirmUserValidation(request, response);
});

router.post('/reset-password', (request, response) => {
  authController.getNewEmailValidation(request, response);
});

router.post('/new-password', (request, response) => {
  authController.resetPassword(request, response);
});

router.get('company', (request, response) => {
  companyController.getCompanyList(request, response);
});

export { router };
