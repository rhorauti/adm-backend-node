import { IEmployeeResponse } from '@src/core/interfaces/employee.interface';
import { Employee } from '@models/employee/employee';
import { injectable } from 'tsyringe';
import { dataSource } from '@src/config/data-source.config';
import { Company } from '@src/models/company/company';

@injectable()
export class EmployeeRepository {
  private employeeRepository = dataSource.getRepository(Employee);

  async getEmployees(idCompany: number): Promise<IEmployeeResponse> {
    return await this.employeeRepository
      .createQueryBuilder()
      .relation(Company, 'employee')
      .of(idCompany)
      .loadOne();
  }
}
