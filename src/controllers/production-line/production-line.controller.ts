import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import {
  IProductionLineListResponse,
  IProductionLineResponse,
} from '@core/interfaces/production.interface';
import { ProductionLineRepository } from '@repositories/production-line/production-line.repository';
import { ProductionLine } from '@models/production-line/production-line.model';

@injectable()
export class ProductionLineController {
  constructor(
    @inject('ProductionLineRepository') private repository: ProductionLineRepository,
    @inject('ApiResponse')
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'Linhas de Produção';
  keyId = 'idProductionLine';
  routeNameTranslatedSingular = 'Linha de Produção';
  uniqueConstraint = 'UQ_production_line_code';

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IProductionLineListResponse>> {
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
  ): Promise<Response<IProductionLineResponse>> {
    try {
      const data = await this.repository.getDataByField(
        this.keyId as keyof ProductionLine,
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
  ): Promise<Response<IProductionLineResponse>> {
    try {
      const savedData = await this.repository.save(request.body);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${savedData.lineCode} salvo com sucesso.`,
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
        this.keyId as keyof ProductionLine,
        Number(request.params[this.keyId]),
      );
      await this.repository.delete(data[this.keyId]);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${data.lineCode} excluido com sucesso!`,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro ao excluir ${this.routeNameTranslatedSingular}: ${error.message} `;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
