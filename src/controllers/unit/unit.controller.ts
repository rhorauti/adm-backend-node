import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { UnitRepository } from '@repositories/unit/unit.repository';
import { IUnitResponse } from '@core/interfaces/unit.interface';
import { Unit } from '@models/unit/unit.model';
import { TOKENS } from '@containers/symbol';

@injectable()
export class UnitController {
  constructor(
    @inject(TOKENS.UnitRepository) private repository: UnitRepository,
    @inject(TOKENS.ApiResponse)
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'Unidades';
  keyId = 'idUnit';
  routeNameTranslatedSingular = this.routeNameTranslated.slice(0, -1);
  uniqueConstraint = 'UQ_unit_name';

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IUnitResponse>> {
    try {
      const dataList = await this.repository.getDataList();
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslated} enviados com sucesso.`,
        dataList,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro na consulta ${this.routeNameTranslated}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async getData(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IUnitResponse>> {
    try {
      const data = await this.repository.getDataByField(
        this.keyId as keyof Unit,
        request.body[this.keyId],
      );
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} enviado com sucesso.`,
        data,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro na consulta ${this.routeNameTranslatedSingular}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IUnitResponse>> {
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
      const data = await this.repository.getDataByField(
        this.keyId as keyof Unit,
        Number(request.params[this.keyId]),
      );
      await this.repository.delete(data[this.keyId]);
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
