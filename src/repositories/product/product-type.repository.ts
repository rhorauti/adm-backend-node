import { ProductType } from '@models/product/product-type.model';
import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class ProductTypeRepository {
  private repository: Repository<ProductType>;

  keyId: keyof ProductType = 'idProductType';

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ProductType);
  }

  async getDataList(): Promise<ProductType[]> {
    return this.repository.find({
      order: { [this.keyId]: 'DESC' },
    });
  }

  async getDataByField<K extends keyof ProductType>(
    key: K,
    value: ProductType[K],
  ): Promise<ProductType> {
    return await this.repository.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async save(data: ProductType): Promise<ProductType> {
    emptyStringToNull(data);
    return this.repository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
