import { EmployeeRepository } from '@repositories/employee/employee.repository';
import { IEmployeeResponse } from '@core/interfaces/employee.interface';
import { CustomError } from '@middlewares/error';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class EmployeeController {
  constructor(
    @inject('EmployeeRepository') private repository: EmployeeRepository,
    @inject('ApiResponse')
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'funcionários';
  keyId = 'idEmployee';
  relatedKeyId = 'idCompany';
  routeNameTranslatedSingular = 'do' + this.routeNameTranslated.slice(0, -1);

  async getData(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeeResponse>> {
    try {
      const data = await this.repository.getData(Number(request.params[this.relatedKeyId]));
      return this.apiResponse.Ok(
        response,
        200,
        `Dados ${this.routeNameTranslatedSingular} enviado com sucesso.`,
        data,
      );
    } catch (error: unknown) {
      const customError = error as CustomError;
      customError.message = `Erro de conexão com o banco de dados ao consultar os dados ${this.routeNameTranslatedSingular}.`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
