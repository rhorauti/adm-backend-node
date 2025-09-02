import { EmployeeRepository } from '@repositories/employee/employee.repository';
import { IEmployeeListResponse, IEmployeeResponse } from '@core/interfaces/employee.interface';
import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';

@injectable()
export class EmployeeController {
  constructor(
    @inject('EmployeeRepository') private repository: EmployeeRepository,
    @inject('ApiResponse')
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'funcionários';
  uniqueConstraint = 'UQ_employee_cpf';
  keyId = 'idEmployee';
  relatedKeyId = 'idCompany';
  routeNameTranslatedSingular = 'do' + this.routeNameTranslated.slice(0, -1);

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeeListResponse>> {
    try {
      const dataList = await this.repository.getDataList();
      return this.apiResponse.Ok(
        response,
        200,
        `Dados de ${this.routeNameTranslated} enviados com sucesso.`,
        dataList,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro de conexão com o banco de dados ao consultar a lista de ${this.routeNameTranslated}:  ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

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

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeeListResponse>> {
    try {
      const savedData = await this.repository.save(request.body);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${savedData.name} salvo com sucesso.`,
        savedData,
      );
    } catch (error) {
      const customError = error as CustomError;
      if ((error && error.code == 'ER_DUP_ENTRY') || error?.code === '23505') {
        customError.statusCode = 409;
        if (error.message.includes(this.uniqueConstraint)) {
          const uniqueConstraintArray = this.uniqueConstraint.split('_');
          customError.message = `O ${uniqueConstraintArray[uniqueConstraintArray.length - 1]} já existe e não pode estar duplicado.`;
        } else {
          customError.message = 'Registro duplicado.';
        }
        this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else {
        customError.message = `Erro de conexão com o banco de dados ao consultar a tabela de ${this.routeNameTranslated}.`;
        this.apiResponse.Error(response, 500, customError.message);
      }
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDefaultResponse>> {
    try {
      const data = await this.repository.getData(Number(request.params[this.keyId]));
      await this.repository.delete(data[this.keyId]);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${data.name} excluido com sucesso!`,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro de conexão com o banco de dados excluir o ${this.routeNameTranslatedSingular}: ${error.message} `;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
