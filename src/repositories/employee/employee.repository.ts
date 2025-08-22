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
    this.employeePositionRepository = this.dataSource.getRepository(EmployeePosition);
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
    return this.employeePositionRepository.find({
      order: { idEmployeePosition: 'DESC' },
    });
  }

  async getEmployeePosition(idEmployeePosition: number): Promise<EmployeePosition> {
    return await this.employeePositionRepository.findOne({
      where: {
        idEmployeePosition: idEmployeePosition,
      },
    });
  }

  async saveEmployeePosition(position: EmployeePosition): Promise<EmployeePosition> {
    return this.employeePositionRepository.save(position);
  }

  async deleteEmployeePosition(idEmployeePosition: number): Promise<void> {
    await this.employeePositionRepository.delete(idEmployeePosition);
  }
}
