import { IEmployeeDTO } from '@core/interfaces/employee.interface';
import { Employee } from '@models/employee/employee.model';
import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';

@injectable()
export class EmployeeRepository {
  private employeeRepository: Repository<Employee>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.employeeRepository = this.dataSource.getRepository(Employee);
  }

  // keyId = 'idEmployee';
  // relatedKeyId = 'idCompany';

  // async getDataList(): Promise<Employee[]> {
  //   return this.employeeRepository.find({
  //     order: { [this.keyId]: 'DESC' },
  //   });
  // }

  async getCompleteDataList(): Promise<IEmployeeDTO[]> {
    const query = await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.employeePosition', 'position')
      .orderBy('employee.idEmployee', 'DESC')
      .getRawMany();
    return query.map(row => ({
      idEmployee: row.employee_idEmployee,
      isDefault: row.employee_isDefault,
      name: row.employee_name,
      email: row.employee_email,
      deskphone: row.employee_deskphone,
      photoUrl: row.employee_photoUrl,
      cellphone: row.employee_cellphone,
      department: row.department_name,
      position: row.position_name,
    })) as IEmployeeDTO[];
  }

  // async getDataByField<K extends keyof Employee>(key: K, value: Employee[K]): Promise<Employee> {
  //   return await this.employeeRepository.findOne({
  //     where: {
  //       [key]: value,
  //     },
  //   });
  // }

  // async getDataListByField(object: FindOptionsWhere<Employee>): Promise<Employee[]> {
  //   return await this.employeeRepository.find({
  //     where: object,
  //   });
  // }

  // async getData(object: FindOptionsWhere<Employee>): Promise<Employee> {
  //   return await this.employeeRepository.findOne({
  //     where: object,
  //   });
  // }

  // async updateField<K extends keyof Employee>(
  //   idEmployee: Employee['idEmployee'],
  //   key: K,
  //   value: Employee[K],
  // ) {
  //   this.employeeRepository.update(idEmployee, { [key]: value });
  // }

  // async save(employeeData: Employee): Promise<Employee> {
  //   emptyStringToNull(employeeData);
  //   return this.employeeRepository.save(employeeData);
  // }

  // async delete(idEmployee: number): Promise<void> {
  //   await this.employeeRepository.delete(idEmployee);
  // }
}
