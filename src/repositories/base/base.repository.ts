import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, EntityTarget, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';

@injectable()
export class BaseRepository<T> {
  protected readonly repository: Repository<T>;

  constructor(
    @inject('DataSource') private dataSource: DataSource,
    entity: EntityTarget<T>,
  ) {
    this.repository = this.dataSource.getRepository(entity);
  }

  getDataList = async (key: keyof T, sortMethod = 'DESC'): Promise<T[]> => {
    return this.repository.find({
      order: { [key]: sortMethod } as FindOptionsOrder<T>,
    });
  };

  async getDataListByField(object: FindOptionsWhere<T>): Promise<T[]> {
    return await this.repository.find({
      where: object,
    });
  }

  async getDataByField(object: FindOptionsWhere<T>): Promise<T> {
    return await this.repository.findOne({
      where: object,
    });
  }

  async save(data: T): Promise<T> {
    emptyStringToNull(data);
    return this.repository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
