import { ProductionLine } from '@models/production-line/production-line.model';
import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class ProductionLineRepository {
  private repository: Repository<ProductionLine>;

  keyId: keyof ProductionLine = 'idProductionLine';

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ProductionLine);
  }

  async getDataList(): Promise<ProductionLine[]> {
    return this.repository.find({
      order: { [this.keyId]: 'DESC' },
    });
  }

  async getDataByField<K extends keyof ProductionLine>(
    key: K,
    value: ProductionLine[K],
  ): Promise<ProductionLine> {
    return await this.repository.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async save(data: ProductionLine): Promise<ProductionLine> {
    emptyStringToNull(data);
    return this.repository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
