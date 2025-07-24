import { AuthController } from '@controllers/auth/auth.controller';
import { Router } from 'express';
import { container } from 'tsyringe';

const authRoute = Router();

const authController = container.resolve(AuthController);

authRoute.post('/login', (request, response, next) => {
  authController.loginUser(request, response, next);
});

authRoute.post('/signup', (request, response, next) => {
  authController.createNewUser(request, response, next);
});

authRoute.get('/email-validation', (request, response, next) => {
  authController.confirmUserValidation(request, response, next);
});

authRoute.post('/reset-password', (request, response, next) => {
  authController.getNewEmailValidation(request, response, next);
});

authRoute.post('/new-password', (request, response, next) => {
  authController.resetPassword(request, response, next);
});

export { authRoute };
