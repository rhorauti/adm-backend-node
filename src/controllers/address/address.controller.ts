import { AddressRepository } from '@repositories/address/address.repository';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AddressController {
  constructor(@inject('AddressRepository') private addressRepository: AddressRepository) {}

  async getAddressList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { page, limit, input, select, idCompany } = request.query;
      const companies = await this.addressRepository.getAddresses(
        Number(page),
        Number(limit),
        input.toString(),
        select.toString(),
        Number(idCompany),
      );
      return response.status(200).json({
        date: new Date(),
        status: true,
        msg: 'Lista recebida com sucesso!',
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  }

  async saveAddress(request: Request, response: Response, next: NextFunction): Promise<Response> {
    try {
      const existingRegister = await this.addressRepository.checkExistingRegister(request.body);
      if (existingRegister) {
        return response.status(400).json({
          status: false,
          msg: 'Registro já existente!',
        });
      } else {
        const message = await this.checkExistingNickname(request, next);
        if (message && message.length > 0) {
          return response.status(400).json({
            status: false,
            msg: message,
          });
        } else {
          await this.addressRepository.save(request.body);
          return response.status(200).json({
            status: true,
            msg: 'Empresa salva com sucesso!',
          });
        }
      }
    } catch (e) {
      console.log(e.error.msg);
      next(e);
    }
  }

  async checkExistingNickname(request: Request, next: NextFunction): Promise<string> {
    try {
      const { nickname } = request.body;
      const address = await this.addressRepository.findByField('nickname', request.body.nickname);
      let msg = '';
      if (address && address.idAddress != request.body.idAddress) {
        if (address.nickname.trim().toLowerCase() == nickname.trim().toLowerCase()) {
          msg = `Esse apelido ${nickname} já existe!`;
        }
      }
      return msg;
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(request: Request, response: Response, next: NextFunction): Promise<Response> {
    const addresses = request.body;
    try {
      addresses.forEach(async addressData => {
        await this.addressRepository.delete(addressData.idAddress);
      });
      return response.status(200).json({
        status: true,
        msg: `${addresses.length == 1 ? addresses[0].nickname : 'Endereços'} excluida(s) com sucesso!`,
      });
    } catch (error) {
      next(error);
    }
  }
}
