import { Product } from '@models/product/product.model';
import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class ProductRepository {
  private repository: Repository<Product>;

  keyId: keyof Product = 'idProduct';

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Product);
  }

  async getDataList(): Promise<Product[]> {
    return this.repository.find({
      order: { [this.keyId]: 'DESC' },
      relations: ['unit', 'productType'],
    });
  }

  async getDataByField<K extends keyof Product>(key: K, value: Product[K]): Promise<Product> {
    return await this.repository.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async updateField<K extends keyof Product>(
    idProduct: Product['idProduct'],
    key: K,
    value: Product[K],
  ): Promise<void> {
    this.repository.update(idProduct, { [key]: value });
  }

  async save(data: Product): Promise<Product> {
    emptyStringToNull(data);
    return this.repository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
