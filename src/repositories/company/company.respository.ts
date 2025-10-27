import { Company } from '@models/company/company.model';
import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { ICompanyForm } from '@core/interfaces/company.interface';

@injectable()
export class CompanyRepository {
  private companyRepository: Repository<Company>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.companyRepository = this.dataSource.getRepository(Company);
  }

  async getCompanyData(idCompany: number): Promise<ICompanyForm | null> {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.address', 'address')
      .leftJoin('company.employee', 'employee', 'employee.isDefault = true')
      .leftJoin('employee.employeePosition', 'employeePosition')
      .leftJoin('employee.department', 'department')
      .addSelect([
        'employee.idEmployee',
        'employee.isDefault',
        'employee.name',
        'employee.email',
        'employee.deskphone',
        'employee.cellphone',
        'employeePosition.idEmployeePosition',
        'employeePosition.name',
        'department.idDepartment',
        'department.name',
      ])
      .where('company.idCompany = :idCompany', { idCompany: idCompany })
      .getOne();
    return company as ICompanyForm | null;
  }
}
