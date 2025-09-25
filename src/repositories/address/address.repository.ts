import { Address } from '@models/address/address.model';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class AddressRepository {
  private respository: Repository<Address>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.respository = this.dataSource.getRepository(Address);
  }
  // keyId = 'idAddress';
  // relatedKey = 'company';

  // async getDataThroughRelation(id: number): Promise<Address> {
  //   return await this.respository.findOne({
  //     where: {
  //       [this.relatedKey]: { [this.keyId]: id },
  //     },
  //   });
  // }
}
