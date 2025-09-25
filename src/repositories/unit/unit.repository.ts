import { Unit } from '@models/unit/unit.model';
import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class UnitRepository {
  private repository: Repository<Unit>;

  keyId: keyof Unit = 'idUnit';

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Unit);
  }

  // async getDataList(): Promise<Unit[]> {
  //   return this.repository.find({
  //     order: { [this.keyId]: 'DESC' },
  //   });
  // }

  // async getDataByField<K extends keyof Unit>(key: K, value: Unit[K]): Promise<Unit> {
  //   return await this.repository.findOne({
  //     where: {
  //       [key]: value,
  //     },
  //   });
  // }

  // async save(data: Unit): Promise<Unit> {
  //   emptyStringToNull(data);
  //   return this.repository.save(data);
  // }

  // async delete(id: number): Promise<void> {
  //   await this.repository.delete(id);
  // }
}
