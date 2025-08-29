import { Employee } from '@models/employee/employee.model';
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

  async getData(id: number): Promise<Employee> {
    return await this.repository.findOne({
      where: {
        company: { [this.relatedKeyId]: id } as FindOptionsWhere<Employee>,
      },
    });
  }
}
