import { dataSource } from '@src/config/data-source.config';
import { Address } from '@src/models/address/address';
import { Company } from '@src/models/company/company';
import { injectable } from 'tsyringe';

@injectable()
export class AddressRepository {
  private addressRepository = dataSource.getRepository(Address);

  async getAddress(idCompany: number): Promise<Address> {
    return this.addressRepository
      .createQueryBuilder()
      .relation(Company, 'address')
      .of(idCompany)
      .loadOne();
  }
}
