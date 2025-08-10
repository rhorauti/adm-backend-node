import { Address } from '@models/address/address';
import { Company } from '@models/company/company';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class AddressRepository {
  private addressRepository: Repository<Address>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.addressRepository = this.dataSource.getRepository(Address);
  }

  async getAddress(idCompany: number): Promise<Address> {
    return this.addressRepository
      .createQueryBuilder()
      .relation(Company, 'address')
      .of(idCompany)
      .loadOne();
  }
}
