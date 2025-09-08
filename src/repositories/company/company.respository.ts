import { Company } from '@models/company/company.model';
import { inject, injectable } from 'tsyringe';
import { DataSource, DeepPartial, FindOneOptions, QueryRunner, Repository } from 'typeorm';
import { ICompanyDetail } from '@core/interfaces/company.interface';
import { Address } from '@models/address/address.model';
import { Employee } from '@models/employee/employee.model';
import { CustomError } from '@middlewares/error.middleware';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { emptyStringToNull } from '@utils/misc';
import { Department } from '@models/department/department.model';

@injectable()
export class CompanyRepository {
  private companyRepository: Repository<Company>;
  private addressRepository: Repository<Address>;
  private employeeRepository: Repository<Employee>;
  private departmentRepository: Repository<Department>;
  private employeePositionRepository: Repository<EmployeePosition>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.companyRepository = this.dataSource.getRepository(Company);
    this.addressRepository = this.dataSource.getRepository(Address);
    this.employeeRepository = this.dataSource.getRepository(Employee);
    this.departmentRepository = this.dataSource.getRepository(Department);
    this.employeePositionRepository = this.dataSource.getRepository(EmployeePosition);
  }

  async getCompanies(): Promise<Company[]> {
    return this.companyRepository.find({
      order: { idCompany: 'DESC' },
    });
  }

  async getCompanyCompleteInfo(idCompany: number): Promise<ICompanyDetail> {
    let currentStep = 'initial';
    try {
      currentStep = 'getting-company';
      const company = await this.companyRepository.findOne({ where: { idCompany: idCompany } });

      currentStep = 'getting-address';
      const address = await this.addressRepository.findOne({
        where: { company: { idCompany: idCompany } },
      });
      currentStep = 'getting-employee';
      const employee = await this.employeeRepository.findOne({
        where: { company: { idCompany: idCompany } },
      });

      currentStep = 'getting-employee-position';
      const employeePosition = await this.employeePositionRepository.findOne({
        where: { employee: { idEmployee: employee.idEmployee } },
      });

      currentStep = 'getting-employee-position';
      const department = await this.departmentRepository.findOne({
        where: { employee: { idEmployee: employee.idEmployee } },
      });
      employee.employeePosition = employeePosition;
      employee.department = department;

      return {
        company: company,
        address: address,
        employee: employee,
      };
    } catch (error) {
      const customError = error as CustomError;
      customError.step = currentStep;
      throw customError;
    }
  }

  async findCompanyByField(fields: DeepPartial<Company>): Promise<Company> {
    return await this.companyRepository.findOne({
      where: fields,
    } as FindOneOptions<Company>);
  }

  async addCompany(companyData: ICompanyDetail): Promise<ICompanyDetail> {
    console.log('companyData', companyData);
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let currentStep = 'initial';
    let savedCompany: Company | null = null;

    try {
      const companyRepository = queryRunner.manager.getRepository(Company);
      const addressRepository = queryRunner.manager.getRepository(Address);
      const employeeRepository = queryRunner.manager.getRepository(Employee);

      emptyStringToNull(companyData.company);
      emptyStringToNull(companyData.address);
      emptyStringToNull(companyData.employee);

      currentStep = 'saving-company';
      companyData.company.idCompany = null;
      const company = companyRepository.create({
        ...companyData.company,
      });
      savedCompany = await queryRunner.manager.save(company);

      currentStep = 'saving-address';
      companyData.address.idAddress = null;
      const address = addressRepository.create({
        ...companyData.address,
        company: savedCompany,
      });
      const savedAddress = await queryRunner.manager.save(address);

      currentStep = 'saving-employee';
      const employeePositionToBeSaved = companyData.employee.employeePosition as EmployeePosition;
      const employeeDataToSave = employeeRepository.create({
        ...companyData.employee,
        company: savedCompany,
        department: companyData.employee.department
          ? { idDepartment: Number(companyData.employee.department.idDepartment) }
          : null,
        employeePosition: employeePositionToBeSaved,
      });
      const savedEmployee = await queryRunner.manager.save(employeeDataToSave);

      await queryRunner.commitTransaction();

      return {
        company: savedCompany,
        address: savedAddress,
        employee: savedEmployee,
      };
    } catch (error) {
      const customError = error as CustomError;
      customError.step = currentStep;
      await queryRunner.rollbackTransaction();
      throw customError;
    } finally {
      await queryRunner.release();
    }
  }

  async updateCompany(companyData: ICompanyDetail): Promise<ICompanyDetail> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let currentStep = 'initial';

    try {
      const companyRepository = queryRunner.manager.getRepository(Company);
      const addressRepository = queryRunner.manager.getRepository(Address);
      const employeeRepository = queryRunner.manager.getRepository(Employee);

      emptyStringToNull(companyData.company);
      emptyStringToNull(companyData.address);
      emptyStringToNull(companyData.employee);

      const idCompany = Number(companyData.company.idCompany);

      currentStep = 'getting-company';
      await companyRepository.findOne({ where: { idCompany: idCompany } });

      currentStep = 'getting-address';
      await addressRepository.findOne({ where: { company: { idCompany: idCompany } } });

      currentStep = 'getting-employee';
      await employeeRepository.findOne({ where: { company: { idCompany: idCompany } } });

      currentStep = 'saving-company';
      const companyToBeUpdated = companyRepository.create(companyData.company);
      const updatedCompany = await queryRunner.manager.save(companyToBeUpdated);

      currentStep = 'saving-address';

      const addressToBeUpdated = addressRepository.create(companyData.address);
      const updatedAddress = await queryRunner.manager.save(addressToBeUpdated);

      currentStep = 'getting-department';
      console.log('department', companyData.employee.department);

      const employeeToBeUpdated = employeeRepository.create({
        ...companyData.employee,
        company: updatedCompany,
        department: companyData.employee.department
          ? { idDepartment: Number(companyData.employee.department.idDepartment) }
          : null,
      });
      const updatedEmployee = await queryRunner.manager.save(employeeToBeUpdated);

      await queryRunner.commitTransaction();
      return {
        company: updatedCompany,
        address: updatedAddress,
        employee: updatedEmployee,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const customError = error as CustomError;
      customError.step = currentStep;
      throw customError;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCompany(idCompany: number): Promise<void> {
    await this.companyRepository.delete(idCompany);
  }
}
