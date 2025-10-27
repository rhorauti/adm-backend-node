import { IEmployeeCompany } from '@core/interfaces/company.interface';
import { IEmployeeDTO, IEmployeeForm } from '@core/interfaces/employee.interface';
import { Employee } from '@models/employee/employee.model';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class EmployeeRepository {
  private employeeRepository: Repository<Employee>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.employeeRepository = this.dataSource.getRepository(Employee);
  }

  async getEmployeeList(idCompany: number): Promise<IEmployeeCompany[]> {
    const query = await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.employeePosition', 'employeePosition')
      .leftJoin('employee.company', 'company')
      .where('company.idCompany = :idCompany', { idCompany })
      .orderBy('employee.idEmployee', 'DESC')
      .getRawMany();
    return query.map(row => ({
      idEmployee: row.employee_id_employee,
      isDefault: row.employee_isDefault,
      name: row.employee_name,
      email: row.employee_email,
      deskphone: row.employee_deskphone,
      cellphone: row.employee_cellphone,
      department: row.department_name,
      employeePosition: row.employeePosition_name,
    }));
  }

  async getEmployeeData(idCompany: number): Promise<IEmployeeCompany> {
    return await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.employeePosition', 'position')
      .leftJoin('employee.company', 'company')
      .where('company.idCompany = :idCompany', { idCompany })
      .andWhere('employee.isDefault = true')
      .getOne();
    // return query.map(row => ({
    //   idEmployee: row.employee_idEmployee,
    //   isDefault: row.employee_isDefault,
    //   name: row.employee_name,
    //   email: row.employee_email,
    //   deskphone: row.employee_deskphone,
    //   photoUrl: row.employee_photoUrl,
    //   cellphone: row.employee_cellphone,
    //   department: { idDepartment: row.department_idDepartment, name: row.department_name },
    //   employeePosition: {
    //     idEmployeePosition: row.employeePosition_idEmployeePosition,
    //     name: row.employeePosition_name,
    //   },
    // }));
  }
}
