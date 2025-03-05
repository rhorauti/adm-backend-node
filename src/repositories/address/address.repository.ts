import { IAddress } from '@core/interfaces/IAddress';
import { dataSource } from '@src/migrations';
import { Address } from '@src/models/address/address';
import { injectable } from 'tsyringe';

@injectable()
export class AddressRepository {
  private addressRepository = dataSource.getRepository(Address);

  async getAllAddresses(): Promise<Address[]> {
    return await this.addressRepository.find();
  }

  async findAddressById(id: number): Promise<Address> {
    return await this.addressRepository.findOne({
      where: { idAddress: id },
    });
  }

  async checkRegisterAlreadyExist(addressInfo: IAddress): Promise<Address> {
    return await this.addressRepository.findOne({
      where: {
        nickname: addressInfo.nickname,
        postalCode: addressInfo.postalCode,
        address: addressInfo.address,
        number: addressInfo.number,
        complement: addressInfo.complement,
        district: addressInfo.district,
        city: addressInfo.city,
        company: { idCompany: addressInfo.idCompany },
      },
    });
  }

  async saveAddress(data: IAddress): Promise<Address> {
    return await this.addressRepository.save({ ...data, company: { idCompany: data.idCompany } });
  }

  async deleteAddress(id: number): Promise<void> {
    await this.addressRepository.delete(id);
  }
}
