import { IEmployee } from '@core/interfaces/IEmployee';
import { dataSource } from '@src/migrations';
import { Employee } from '@models/employee/employee';
import { injectable } from 'tsyringe';

@injectable()
export class EmployeeRepository {
  private employeeRepository = dataSource.getRepository(Employee);

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.find();
  }

  async findEmployeeById(id: number): Promise<IEmployee> {
    return await this.employeeRepository.findOne({
      where: { idEmployee: id },
    });
  }

  async saveEmployee(data: IEmployee): Promise<Employee> {
    return await this.employeeRepository.save(data);
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}
