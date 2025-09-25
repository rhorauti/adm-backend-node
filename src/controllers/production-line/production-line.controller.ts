import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { IProductionLineResponse } from '@core/interfaces/production.interface';
import { ProductionLine } from '@models/production-line/production-line.model';
import { emptyStringToNull } from '@utils/misc';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';

@injectable()
export class ProductionLineController {
  constructor(
    @inject(TOKENS.ProductionLineBaseRepository)
    private baseRepository: BaseRepository<ProductionLine>,
    @inject(TOKENS.ApiResponse)
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
  ): Promise<Response<IProductionLineResponse>> {
    try {
      const dataList = await this.baseRepository.getDataList('idProductionLine');
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
      const data = await this.baseRepository.getDataByField({
        [this.keyId]: request.body[this.keyId],
      });
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
      emptyStringToNull(request.body);
      const toolingListStringify = JSON.stringify(request.body.toolingList);
      if (toolingListStringify == JSON.stringify([])) request.body.toolingList = null;
      const savedData = await this.baseRepository.save(request.body);
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
      const data = await this.baseRepository.getDataByField({
        [this.keyId]: Number(request.params[this.keyId]),
      });
      await this.baseRepository.delete(data[this.keyId]);
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
