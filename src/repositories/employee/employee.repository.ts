import { Employee } from '@models/employee/employee';
import { inject, injectable } from 'tsyringe';
import { Company } from '@models/company/company';
import { DataSource, Repository } from 'typeorm';
import { EmployeePosition } from '@models/employee/employee-position';
import { Department } from '@models/department/department';

@injectable()
export class EmployeeRepository {
  private employeeRepository: Repository<Employee>;
  private employeePositionRepository: Repository<EmployeePosition>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.employeeRepository = this.dataSource.getRepository(Employee);
  }

  async getEmployee(idCompany: number): Promise<Employee> {
    return await this.employeeRepository
      .createQueryBuilder()
      .relation(Company, 'employee')
      .relation(Department, 'employee')
      .relation(EmployeePosition, 'employee')
      .of(idCompany)
      .loadOne();
  }

  async getEmployeePositionList(): Promise<EmployeePosition[]> {
    return this.employeePositionRepository.find();
  }

  async getEmployeePosition(idEmployeePosition: number): Promise<EmployeePosition> {
    return await this.employeePositionRepository
      .createQueryBuilder()
      .relation(EmployeePosition, 'employee')
      .of(idEmployeePosition)
      .loadOne();
  }

  async saveEmployeePosition(position: EmployeePosition): Promise<EmployeePosition> {
    return this.employeePositionRepository.save(position);
  }
}
