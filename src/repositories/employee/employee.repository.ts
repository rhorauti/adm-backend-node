import { IEmployeeResponse } from '@core/interfaces/employee.interface';
import { Employee } from '@models/employee/employee';
import { injectable } from 'tsyringe';
import { dataSource } from '@config/data-source.config';
import { Company } from '@models/company/company';

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
