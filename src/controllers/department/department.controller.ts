import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { DepartmentRepository } from '@repositories/department/department.repository';
import { Department } from '@models/department/department.model';
import { IDepartmentResponse } from '@core/interfaces/department.interface';
import { TOKENS } from '@containers/symbol';

@injectable()
export class DepartmentController {
  constructor(
    @inject(TOKENS.DepartmentRepository) private repository: DepartmentRepository,
    @inject(TOKENS.ApiResponse)
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'Departamentos';
  keyId: keyof Department = 'idDepartment';
  routeNameTranslatedSingular = this.routeNameTranslated.slice(0, -1);
  uniqueConstraint = 'UQ_department_name';

  async getData(request: Request, response: Response, next: NextFunction): Promise<Response> {
    try {
      const body = request.query as Partial<Department>;
      const entries = Object.entries(body);
      if (entries && entries.length > 0) {
        const [key, value] = entries[0];
        const dept = await this.repository.getDataByField(key as keyof Department, value);
        if (!dept || dept == null) {
          return this.apiResponse.Error(response, 400, 'Departamento não encontrado.');
        } else {
          return this.apiResponse.Ok(response, 200, 'Departamento enviado com sucesso.', dept);
        }
      } else {
        const dataList = await this.repository.getDataList();
        return this.apiResponse.Ok(
          response,
          200,
          `${this.routeNameTranslated} enviados com sucesso.`,
          dataList,
        );
      }
    } catch (error) {
      const customError = error as CustomError;
      this.apiResponse.Error(response, 500, 'Erro de consulta: ' + customError.message);
    }
  }

  async getDataByField(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDepartmentResponse>> {
    try {
      const data = await this.repository.getDataByField(this.keyId, request.body[this.keyId]);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} enviado com sucesso.`,
        data,
      );
    } catch (error) {
      const customError = error as CustomError;
      this.apiResponse.Error(response, 500, 'Erro de consulta: ' + customError.message);
    }
  }

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDepartmentResponse>> {
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
          customError.message = `${this.routeNameTranslatedSingular} já existe e não pode estar duplicado.`;
        } else {
          customError.message = 'Registro duplicado.';
        }
        this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else {
        this.apiResponse.Error(response, 500, 'Erro ao salvar: ' + customError.message);
      }
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDefaultResponse>> {
    try {
      const data = await this.repository.getDataByField(
        this.keyId,
        Number(request.params[this.keyId]),
      );
      await this.repository.delete(data[this.keyId] as number);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${data.name} excluido com sucesso!`,
      );
    } catch (error) {
      const customError = error as CustomError;
      this.apiResponse.Error(response, 500, 'Erro ao excluir: ' + customError.message);
    }
  }
}
