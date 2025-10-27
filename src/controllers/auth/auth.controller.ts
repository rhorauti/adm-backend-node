import { NextFunction, Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import { EmailSender } from '@services/email.service';
import { inject, injectable } from 'tsyringe';
import { ApiResponse } from '@utils/api-response';
import { JwtHandler } from '@services/jwt.service';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import { User } from '@models/auth/user.model.';

@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.AuthBaseRepository) private baseRepository: BaseRepository<User>,
    @inject(TOKENS.EmailSender) private emailSender: EmailSender,
    @inject(TOKENS.ApiResponse) private apiResponse: ApiResponse,
    @inject(TOKENS.JwtHandler) private jwtHandler: JwtHandler,
  ) {}

  /**
   * loginUser
   * Verifica se o e-mail recebido é valido para realizar o login
   * @param { Request } request dados recebidos do frontend
   * @param { Response } response dados que serão enviados para o frontend
   * @returns Resposta com o status, mensagem e dados do usuário e token
   */
  async loginUser(request: Request, response: Response, next: NextFunction): Promise<Response> {
    try {
      const user = await this.baseRepository.getData({ where: { email: request.body.email } });
      if (!user) {
        return this.apiResponse.Error(response, 401, 'Email inválido.');
      } else if (user && !user.emailConfirmed) {
        this.emailSender.sendEmailConfirmationSignUp(user);
        return this.apiResponse.Error(
          response,
          401,
          'Email não validado. Enviamos novamente um e-mail para validação.',
        );
      } else {
        const passwordConfirmed = await compare(request.body.password, user.password);
        if (!passwordConfirmed) {
          return this.apiResponse.Error(response, 401, 'Senha inválida.');
        } else {
          const token = this.jwtHandler.signToken(
            { id: user.idUser, email: user.email },
            { expiresIn: process.env.JWT_EXPIRES_IN },
          );
          const data = { user, token };
          return this.apiResponse.Ok(response, 200, 'Login efetuado com sucesso.', data);
        }
      }
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * createNewUser
   * Cria um novo usuário no banco de dados.
   * @param request dados recebidos do frontend
   * @param response dados que serão enviados para o frontend
   * @returns Resposta com o status, mensagem e dados do usuário.
   */
  async createNewUser(request: Request, response: Response, next: NextFunction): Promise<Response> {
    try {
      const userExists = await this.baseRepository.getData({
        where: { email: request.body.email },
      });
      if (userExists) {
        return this.apiResponse.Error(response, 401, 'Email já cadastrado.');
      } else {
        const hashedPassword = await hash(request.body.password, 10);
        const newUserInfo = {
          idUser: null,
          name: request.body.name,
          email: request.body.email,
          password: hashedPassword,
          accessLevel: 1,
          isActive: true,
          emailConfirmed: false,
        };
        const newUser = await this.baseRepository.save(newUserInfo);
        if (!newUser) {
          return this.apiResponse.Error(response, 500, 'Erro interno do servidor.');
        } else {
          this.emailSender.sendEmailConfirmationSignUp(newUser);
          return this.apiResponse.Ok(response, 200, 'Usuário cadastrado com sucesso', newUser);
        }
      }
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * confirmUserValidation
   * Verifica se o o e-mail do usuário foi validado ou não
   * @param request dados recebidos do frontend
   * @param response dados que serão enviados para o frontend
   * @returns Promise com o status, mensagem e dados do usuário.
   */
  async confirmUserValidation(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = request.query.token as string;
      this.jwtHandler.verifyToken(token, async (error: any, decodedUser: any) => {
        if (error) {
          return this.apiResponse.Error(response, 401, 'Token inválido ou expirado.');
        } else {
          const decodedEmail = decodedUser.email;
          const user = await this.baseRepository.getData({ where: { email: decodedEmail } });
          if (user.emailConfirmed) {
            return this.apiResponse.Error(response, 401, 'Usuário já validado anteriormente.');
          } else {
            try {
              await this.baseRepository.updateField(
                { email: decodedEmail },
                { emailConfirmed: true },
              );
              return this.apiResponse.Ok(response, 200, 'Usuário validado com sucesso.');
            } catch (error: unknown) {
              next(error);
            }
          }
        }
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getNewEmailValidation(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const user = await this.baseRepository.getData({ where: { email: request.body.email } });
      if (!user) {
        return this.apiResponse.Error(response, 401, 'Email não existe.');
      } else {
        this.emailSender.sendEmailConfirmationResetPassword(user);
        this.apiResponse.Ok(response, 200, 'E-mail enviado para validação.');
      }
    } catch (error: unknown) {
      next(error);
    }
  }

  async resetPassword(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const token = request.query.token as string;
      this.jwtHandler.verifyToken(token, async (error: any, decodedUser: any) => {
        if (error) {
          return this.apiResponse.Error(response, 401, 'Token inválido ou expirado.');
        } else {
          const decodedEmail = decodedUser.email;
          const user = await this.baseRepository.getData({ where: { email: decodedEmail } });
          const isPasswordOk = await compare(request.body.password, user.password);
          if (isPasswordOk) {
            return this.apiResponse.Error(
              response,
              401,
              'A senha digitada deve ser diferente da senha atual.',
            );
          } else {
            const hashedPassword = await hash(request.body.password, 10);
            await this.baseRepository.updateField(
              { email: decodedEmail },
              { password: hashedPassword },
            );
            return this.apiResponse.Ok(response, 200, 'Senha alterada com sucesso.');
          }
        }
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
