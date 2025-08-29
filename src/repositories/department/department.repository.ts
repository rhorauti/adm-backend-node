import { Department } from '@models/department/department.model';
import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class DepartmentRepository {
  private repository: Repository<Department>;

  keyId: keyof Department = 'idDepartment';

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Department);
  }

  async getDataList(): Promise<Department[]> {
    return this.repository.find({
      order: { [this.keyId]: 'DESC' },
    });
  }

  async getDataByField<K extends keyof Department>(
    key: K,
    value: Department[K],
  ): Promise<Department> {
    return await this.repository.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async save(data: Department): Promise<Department> {
    emptyStringToNull(data);
    return this.repository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
