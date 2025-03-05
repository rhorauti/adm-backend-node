import { dataSource } from '@src/migrations';
import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';

@injectable()
export class BaseRepository<AllEntities> {
  protected repository: Repository<AllEntities>;

  constructor(entity: new () => AllEntities) {
    this.repository = dataSource.getRepository(entity);
  }

  /**
   * getList
   *
   * Get list of registers of All entities from the project
   * @param field string - Field name from database
   * @param value T - value used in 'where' query
   * @returns Entity
   */
  async getList<T>(field: string, value: T): Promise<AllEntities[]> {
    return await this.repository
      .createQueryBuilder()
      .where(`${field} = field`, { field: value })
      .getMany();
  }

  /**
   * saveRegister
   * Add or update register
   * @param data Object - data used to insert or update database.
   */
  async saveRegister(data: AllEntities): Promise<AllEntities> {
    return await this.repository.save(data);
  }

  /**
   * deleteRegister
   *
   * Delete a register from database.
   * @param id
   */
  async deleteRegister(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByField<T extends keyof AllEntities>(
    field: T,
    value: AllEntities[T],
  ): Promise<AllEntities | null> {
    return await this.repository.findOne({
      where: { [field]: value } as any,
    });
  }
}
