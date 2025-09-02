import { AddressRepository } from '@repositories/address/address.repository';
import { IAddressResponse } from '@core/interfaces/address.interface';
import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AddressController {
  constructor(
    @inject('AddressRepository') private repository: AddressRepository,
    @inject('ApiResponse') private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'endereços';
  keyId = 'idAddress';
  relatedKeyId = 'idCompany';
  routeNameTranslatedSingular = 'do' + this.routeNameTranslated.slice(0, -1);

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IAddressResponse>> {
    try {
      const data = await this.repository.getDataThroughRelation(
        Number(request.params[this.relatedKeyId]),
      );
      return this.apiResponse.Ok(
        response,
        200,
        `Dados do ${this.routeNameTranslatedSingular} enviado com sucesso`,
        data,
      );
    } catch (e: unknown) {
      const error = e as CustomError;
      error.message = `Erro de conexão com o banco de dados ao consultar os dados ${this.routeNameTranslatedSingular}.`;
      next(error);
    }
  }
}
