import { dataSource } from '@src/config/data-source.config';
import { IAddress } from '@src/core/interfaces/address.interface';
import { Address } from '@src/models/address/address';
import { injectable } from 'tsyringe';

@injectable()
export class AddressRepository {
  private addressRepository = dataSource.getRepository(Address);

  async getAddresses(
    page: number,
    limit: number,
    input: string,
    select: string,
    idCompany: number,
  ): Promise<{ addresses: Address[]; totalPages: number }> {
    let addressesQuery = null;
    const query = this.addressRepository
      .createQueryBuilder('address')
      .where('address.idCompany = :id', { id: idCompany })
      .orderBy('address.idAddress', 'DESC');
    if (['idAddress'].includes(select)) {
      if (input.length > 0) {
        query.andWhere(`address.${select} = :value`, { value: input });
      }
    } else {
      query.andWhere(`LOWER(TRIM(address.${select})) LIKE LOWER(TRIM(:value))`, {
        value: `%${input}%`,
      });
    }
    const total = await query.getCount();
    const totalPages = Math.ceil(total / limit);
    addressesQuery = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .getMany();
    return { addresses: addressesQuery, totalPages };
  }

  async findByField(field: keyof Address, value: string | number): Promise<Address> {
    return await this.addressRepository.findOne({
      where: { [field]: value },
    });
  }

  async checkExistingRegister(data: IAddress): Promise<Address | null> {
    Object.keys(data).forEach(key => {
      if (data['idAddress'] != 0 && (data[key] == '' || data[key] == 0)) {
        data[key] = null;
      }
    });
    const query = this.addressRepository
      .createQueryBuilder('address')
      .where('address.nickname = :nickname', { nickname: data.nickname })
      .andWhere('address.nickname = :postalCode', { postalCode: data.postalCode })
      .andWhere('address.address = :address', { address: data.address })
      .andWhere('address.number = :number', { number: data.number })
      .andWhere('address.complement = :complement', { complement: data.complement })
      .andWhere('address.district = :district', { district: data.district })
      .andWhere('address.city = :city', { city: data.city })
      .andWhere('address.state = :state', { state: data.state });
    return query.getOne();
  }

  async save(data: IAddress): Promise<Address> {
    return await this.addressRepository.save({
      ...data,
      company: data.idCompany ? { idCompany: data.idCompany } : null,
      employee: data.idEmployee ? { idEmployee: data.idEmployee } : null,
    });
  }

  async delete(idAddress: number): Promise<void> {
    await this.addressRepository.delete(idAddress);
  }
}
