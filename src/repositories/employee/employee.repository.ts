import { Employee } from '@models/employee/employee.model';
import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@injectable()
export class EmployeeRepository {
  private repository: Repository<Employee>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Employee);
  }

  keyId = 'idEmployee';
  relatedKeyId = 'idCompany';

  async getDataList(): Promise<Employee[]> {
    return this.repository.find({
      order: { [this.keyId]: 'DESC' },
    });
  }

  async getData(id: number): Promise<Employee> {
    return await this.repository.findOne({
      where: {
        company: { [this.relatedKeyId]: id } as FindOptionsWhere<Employee>,
      },
    });
  }

  async getDataByField<K extends keyof Employee>(key: K, value: Employee[K]): Promise<Employee> {
    return await this.repository.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async save(data: Employee): Promise<Employee> {
    emptyStringToNull(data);
    return this.repository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
