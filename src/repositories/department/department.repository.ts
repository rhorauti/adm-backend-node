import { Department } from '@models/department/department';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';

@injectable()
export class DepartmentRepository {
  private departmentRepository: Repository<Department>;
  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.departmentRepository = this.dataSource.getRepository(Department);
  }

  async getDepartmentList(): Promise<Department[]> {
    return await this.departmentRepository.find();
  }

  async getDepartment(idDepartment: number): Promise<Department> {
    return await this.departmentRepository.findOne({
      where: {
        idDepartment: idDepartment,
      },
    });
  }

  async saveDepartment(departament: Department): Promise<Department> {
    return this.departmentRepository.save(departament);
  }

  async deleteDepartment(idDepartment: number): Promise<void> {
    await this.departmentRepository.delete(idDepartment);
  }
}
