import { IEmployeeCompleteDataResponse, IEmployeeDTO } from '@core/interfaces/employee.interface';
import { Department } from '@models/department/department.model';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { Employee } from '@models/employee/employee.model';
import { emptyStringToNull } from '@utils/misc';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { EmployeePositionRepository } from './employee-position.repository';
import { DepartmentRepository } from '@repositories/department/department.repository';

@injectable()
export class EmployeeRepository {
  private employeeRepository: Repository<Employee>;

  constructor(
    @inject('DataSource') private dataSource: DataSource,
    @inject('EmployeePositionRepository')
    private employeePositionRepository: EmployeePositionRepository,
    @inject('DepartmentRepository') private departmentRepository: DepartmentRepository,
  ) {
    this.employeeRepository = this.dataSource.getRepository(Employee);
  }

  keyId = 'idEmployee';
  relatedKeyId = 'idCompany';

  async getDataList(): Promise<Employee[]> {
    return this.employeeRepository.find({
      order: { [this.keyId]: 'DESC' },
    });
  }

  async getCompleteDataList(): Promise<IEmployeeDTO[]> {
    const query = await this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.employeePosition', 'position')
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

  async getDataByField<K extends keyof Employee>(key: K, value: Employee[K]): Promise<Employee> {
    return await this.employeeRepository.findOne({
      where: {
        [key]: value,
      },
    });
  }

  async save(data: Employee): Promise<Employee> {
    emptyStringToNull(data);
    const department = await this.departmentRepository.getDataByField(
      'idDepartment',
      data.department.idDepartment,
    );
    const employeePosition = await this.employeePositionRepository.getDataByField(
      'idEmployeePosition',
      data.employeePosition.idEmployeePosition,
    );
    data.department = department;
    data.employeePosition = employeePosition;
    return this.employeeRepository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}
