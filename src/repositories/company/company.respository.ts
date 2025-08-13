import { Company } from '@models/company/company';
import { inject, injectable } from 'tsyringe';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ICompanyRegister } from '@core/interfaces/company.interface';
import { Address } from '@models/address/address';
import { Employee } from '@models/employee/employee';
import { ApiResponse } from '@utils/api-response';
import { Department } from '@models/department/department';
import { CustomError } from '@middlewares/error';
import { EmployeePosition } from '@models/employee/employee-position';

@injectable()
export class CompanyRepository {
  private companyRepository: Repository<Company>;

  constructor(
    @inject('DataSource') private dataSource: DataSource,
    @inject('ApiResponse') private apiResponse: ApiResponse,
  ) {
    this.companyRepository = this.dataSource.getRepository(Company);
  }

  async getCompanies(): Promise<Company[]> {
    const query = this.companyRepository
      .createQueryBuilder('company')
      .orderBy('company.idCompany', 'DESC');
    return query.getMany();
  }

  async findCompanyByField(fields: Partial<Company>): Promise<Company> {
    return await this.companyRepository.findOne({
      where: fields,
    });
  }

  async addCompany(companyData: ICompanyRegister): Promise<ICompanyRegister> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let currentStep = 'initial';

    try {
      const companyRepository = queryRunner.manager.getRepository(Company);
      const addressRepository = queryRunner.manager.getRepository(Address);
      const departamentRepository = queryRunner.manager.getRepository(Department);
      const employeePositionRepository = queryRunner.manager.getRepository(EmployeePosition);

      currentStep = 'saving-company';
      companyData.company.idCompany = null;
      const company = companyRepository.create({
        ...companyData.company,
      });
      const savedCompany = await queryRunner.manager.save(company);

      currentStep = 'saving-address';
      companyData.address.idAddress = null;
      const address = addressRepository.create({
        ...companyData.address,
        company: savedCompany,
      });
      const savedAddress = await queryRunner.manager.save(address);

      currentStep = 'finding-department';
      const departmentData = await departamentRepository.findOne({
        where: { name: companyData.employee.department },
      });

      currentStep = 'finding-employee-position';
      const employeePositionData = await employeePositionRepository.findOne({
        where: {
          name: companyData.employee.position,
        },
      });

      const employeeDataToSave: Employee = {
        idEmployee: null,
        isDefault: false,
        name: companyData.employee.name,
        cpf: companyData.employee.cpf,
        email: companyData.employee.email,
        deskphone: companyData.employee.deskphone,
        photoUrl: companyData.employee.photoUrl,
        cellphone: companyData.employee.cellphone,
        department: departmentData,
        employeePosition: employeePositionData,
        company: savedCompany,
      };

      currentStep = 'saving-employee';
      const savedEmployee = await queryRunner.manager.save(employeeDataToSave);

      await queryRunner.commitTransaction();

      return {
        company: savedCompany,
        address: savedAddress,
        employee: {
          idEmployee: savedEmployee.idEmployee,
          isDefault: savedEmployee.isDefault,
          name: savedEmployee.name,
          cpf: savedEmployee.cpf,
          email: savedEmployee.email,
          deskphone: savedEmployee.deskphone,
          photoUrl: savedEmployee.photoUrl,
          cellphone: savedEmployee.cellphone,
          department: savedEmployee.department.name ?? null,
          position: savedEmployee.employeePosition.name ?? null,
        },
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

  async updateCompany(companyData: ICompanyRegister): Promise<ICompanyRegister> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    let currentStep = 'initial';
    try {
      const companyRepository = queryRunner.manager.getRepository(Company);
      const addressRepository = queryRunner.manager.getRepository(Address);
      const employeeRepository = queryRunner.manager.getRepository(Employee);
      const departmentRepository = queryRunner.manager.getRepository(Department);
      const employeePositionRepository = queryRunner.manager.getRepository(EmployeePosition);

      const idCompany = Number(companyData.company.idCompany);

      currentStep = 'finding-company';

      await companyRepository.findOne({ where: { idCompany: idCompany } });

      currentStep = 'finding-address';

      await addressRepository.findOne({ where: { company: { idCompany: idCompany } } });

      currentStep = 'finding-employee';

      await employeeRepository.findOne({ where: { company: { idCompany: idCompany } } });

      currentStep = 'saving-company';

      const updatedCompany = await queryRunner.manager.save({
        ...companyData.company,
      });

      currentStep = 'saving-address';

      const updatedAddress = await queryRunner.manager.save({
        ...companyData.address,
        company: updatedCompany,
      });

      currentStep = 'finding-department';

      const updatedDepartment = await departmentRepository.findOne({
        where: { name: companyData.employee.department.trim() },
      });

      currentStep = 'finding-employee-position';

      const updatedEmployeePosition = await employeePositionRepository.findOne({
        where: { name: companyData.employee.position.trim() },
      });

      currentStep = 'saving-employee';

      const updatedEmployee = await queryRunner.manager.save({
        ...companyData.employee,
        department: updatedDepartment,
        employeePosition: updatedEmployeePosition,
      });

      await queryRunner.commitTransaction();
      return {
        company: updatedCompany,
        address: updatedAddress,
        employee: {
          ...updatedEmployee,
          position: updatedEmployee.employeePosition.name,
          department: updatedEmployee.department.name,
        },
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
