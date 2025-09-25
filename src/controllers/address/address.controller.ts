import { IAddressResponse } from '@core/interfaces/address.interface';
import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import { Address } from '@models/address/address.model';

@injectable()
export class AddressController {
  constructor(
    @inject(TOKENS.AddressBaseRepository) private baseRepository: BaseRepository<Address>,
    @inject(TOKENS.ApiResponse) private apiResponse: ApiResponse,
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
      const data = await this.baseRepository.getDataByField({
        company: { idCompany: Number(request.params[this.relatedKeyId]) },
      });
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
