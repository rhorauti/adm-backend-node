import { IEmployee } from '@src/core/interfaces/employee.interface';
import { Employee } from '@models/employee/employee';
import { injectable } from 'tsyringe';
import { dataSource } from '@src/config/data-source.config';

@injectable()
export class EmployeeRepository {
  private employeeRepository = dataSource.getRepository(Employee);

  async getEmployees(
    page: number,
    limit: number,
    input: string,
    select: string,
    idCompany: number,
  ): Promise<{ employees: Employee[]; totalPages: number }> {
    let employeesQuery = null;
    const query = this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.idCompany = :id', { id: idCompany })
      .orderBy('employee.idEmployee', 'DESC');
    if (['idEmployee'].includes(select)) {
      if (input.length > 0) {
        query.andWhere(`employee.${select} = :value`, { value: input });
      }
    } else {
      query.andWhere(`LOWER(TRIM(employee.${select})) LIKE LOWER(TRIM(:value))`, {
        value: `%${input}%`,
      });
    }
    const total = await query.getCount();
    const totalPages = Math.ceil(total / limit);
    employeesQuery = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .getMany();
    return { employees: employeesQuery, totalPages };
  }

  async findByField(field: keyof Employee, value: string | number): Promise<Employee> {
    return await this.employeeRepository.findOne({
      where: { [field]: value },
    });
  }

  async save(data: IEmployee): Promise<Employee> {
    return await this.employeeRepository.save({
      ...data,
      company: data.idCompany ? { idCompany: data.idCompany } : null,
    });
  }

  async delete(idEmployee: number): Promise<void> {
    await this.employeeRepository.delete(idEmployee);
  }
}
