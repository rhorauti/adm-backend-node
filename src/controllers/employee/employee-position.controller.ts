import { IEmployeePositionResponse } from '@core/interfaces/employee.interface';
import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import { EmployeePosition } from '@models/employee/employee-position.model';

@injectable()
export class EmployeePositionController {
  constructor(
    @inject(TOKENS.EmployeePositionBaseRepository)
    private baseRepository: BaseRepository<EmployeePosition>,
    @inject(TOKENS.ApiResponse)
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'Cargos';
  keyId = 'idEmployeePosition';
  routeNameTranslatedSingular = this.routeNameTranslated.slice(0, -1);
  uniqueConstraint = 'UQ_employee_position_name';

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeePositionResponse>> {
    try {
      const dataList = await this.baseRepository.getDataList({
        order: { idEmployeePosition: 'DESC' },
      });
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslated} enviados com sucesso.`,
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
  ): Promise<Response<IEmployeePositionResponse>> {
    try {
      const data = await this.baseRepository.getData({
        where: {
          idEmployeePosition: Number(request.params[this.keyId]),
        },
      });
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} enviado com sucesso.`,
        data,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro na consulta de ${this.routeNameTranslatedSingular}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeePositionResponse>> {
    try {
      const savedData = await this.baseRepository.save(request.body);
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
        customError.message = `Erro ao salvar ${this.routeNameTranslated}: ${error.message}`;
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
      const data = await this.baseRepository.getData({
        where: {
          idEmployeePosition: Number(request.params[this.keyId]),
        },
      });
      await this.baseRepository.delete(data[this.keyId]);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${data.name} excluido com sucesso!`,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro ao excluir ${this.routeNameTranslatedSingular}: ${error.message} `;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
