import { AddressRepository } from '@repositories/address/address.repository';
import { IAddressResponse } from '@src/core/interfaces/address.interface';
import { ICompanyParams } from '@src/core/interfaces/company.interface';
import { CustomError } from '@src/middlewares/error';
import { ApiResponse } from '@src/utils/api-response';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AddressController {
  constructor(
    @inject('AddressRepository') private addressRepository: AddressRepository,
    @inject('ApiResponse') private apiResponse: ApiResponse,
  ) {}

  async getAddressList(
    request: Request<ICompanyParams>,
    response: Response<IAddressResponse>,
    next: NextFunction,
  ): Promise<Response<IAddressResponse>> {
    try {
      const address = await this.addressRepository.getAddress(Number(request.params.idCompany));
      return this.apiResponse.Ok(response, 200, 'Endereço enviado com sucesso', address);
    } catch (e: unknown) {
      const error = e as CustomError;
      error.message = 'Erro de conexão com o banco de dados ao consultar o endereço da empresa.';
      next(error);
    }
  }
}
