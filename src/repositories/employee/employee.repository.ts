import { IEmployeeResponse } from '@core/interfaces/employee.interface';
import { Employee } from '@models/employee/employee';
import { inject, injectable } from 'tsyringe';
import { Company } from '@models/company/company';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class EmployeeRepository {
  private employeeRepository: Repository<Employee>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.employeeRepository = this.dataSource.getRepository(Employee);
  }

  async getEmployees(idCompany: number): Promise<IEmployeeResponse> {
    return await this.employeeRepository
      .createQueryBuilder()
      .relation(Company, 'employee')
      .of(idCompany)
      .loadOne();
  }
}
