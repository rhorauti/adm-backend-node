import { Company } from '@models/company/company';
import { inject, injectable } from 'tsyringe';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ICompanyDetail } from '@core/interfaces/company.interface';
import { Address } from '@models/address/address';
import { Employee } from '@models/employee/employee';
import { Department } from '@models/department/department';
import { CustomError } from '@middlewares/error';
import { EmployeePosition } from '@models/employee/employee-position';
import { emptyStringToNull } from '@utils/misc';

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
    const query = this.companyRepository
      .createQueryBuilder('company')
      .orderBy('company.idCompany', 'DESC');
    return query.getMany();
  }

  async getCompanyCompleteInfo(idCompany: number): Promise<ICompanyDetail> {
    let currentStep = 'initial';
    try {
      currentStep = 'getting-company';
      const company = await this.companyRepository.findOne({ where: { idCompany: idCompany } });

      currentStep = 'getting-address';
      const address = await this.addressRepository.findOne({
        where: { company: { idCompany: idCompany } },
        relations: {
          company: true,
        },
      });
      currentStep = 'getting-employee';
      const employee = await this.employeeRepository.findOne({
        where: { company: { idCompany: idCompany } },
        relations: { company: true },
      });

      currentStep = 'getting-department';
      const department = await this.departmentRepository.findOne({
        where: { employee: { idEmployee: employee.idEmployee } },
        relations: { employee: true },
      });

      currentStep = 'getting-employee-position';
      const employeePosition = await this.employeePositionRepository.findOne({
        where: { employee: { idEmployee: employee.idEmployee } },
        relations: { employee: true },
      });
      return {
        company: company,
        address: {
          idAddress: address.idAddress,
          address: address.address,
          number: address.number,
          postalCode: address.postalCode,
          complement: address.complement,
          city: address.city,
          district: address.district,
          state: address.state,
        },
        employee: {
          idEmployee: employee.idEmployee,
          isDefault: employee.isDefault,
          name: employee.name,
          cpf: employee.cpf,
          department: department?.name ?? null,
          position: employeePosition?.name ?? null,
          email: employee.email,
          deskphone: employee.deskphone,
          cellphone: employee.cellphone,
          photoUrl: employee.photoUrl,
        },
      };
    } catch (error) {
      const customError = error as CustomError;
      customError.step = currentStep;
      throw customError;
    }
  }

  async findCompanyByField(fields: Partial<Company>): Promise<Company> {
    return await this.companyRepository.findOne({
      where: fields,
    });
  }

  async addCompany(companyData: ICompanyDetail): Promise<ICompanyDetail> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let currentStep = 'initial';

    try {
      emptyStringToNull(companyData.company);
      emptyStringToNull(companyData.address);
      emptyStringToNull(companyData.employee);
      const companyRepository = queryRunner.manager.getRepository(Company);
      const addressRepository = queryRunner.manager.getRepository(Address);
      const departamentRepository = queryRunner.manager.getRepository(Department);
      const employeeRepository = queryRunner.manager.getRepository(Employee);
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

      currentStep = 'getting-department';
      const departmentData = await departamentRepository.findOne({
        where: { name: companyData.employee.department },
      });

      currentStep = 'getting-employee-position';
      const employeePositionData = await employeePositionRepository.findOne({
        where: {
          name: companyData.employee.position,
        },
      });

      const employeData: Employee = {
        idEmployee: null,
        isDefault: false,
        name: companyData.employee.name,
        cpf: companyData.employee.cpf,
        email: companyData.employee.email,
        deskphone: companyData.employee.deskphone,
        photoUrl: companyData.employee.photoUrl,
        cellphone: companyData.employee.cellphone,
        department: departmentData ?? null,
        employeePosition: employeePositionData ?? null,
        company: savedCompany ?? null,
      };

      const employeeDataToSave = employeeRepository.create(employeData);
      currentStep = 'saving-employee';
      const savedEmployee = await queryRunner.manager.save(employeeDataToSave);

      await queryRunner.commitTransaction();

      return {
        company: savedCompany,
        address: {
          idAddress: savedAddress.idAddress,
          address: savedAddress.address,
          number: savedAddress.number,
          postalCode: savedAddress.postalCode,
          complement: savedAddress.complement,
          city: savedAddress.city,
          district: savedAddress.district,
          state: savedAddress.state,
        },
        employee: {
          idEmployee: savedEmployee.idEmployee,
          isDefault: savedEmployee.isDefault,
          name: savedEmployee.name,
          cpf: savedEmployee.cpf,
          email: savedEmployee.email,
          deskphone: savedEmployee.deskphone,
          photoUrl: savedEmployee.photoUrl,
          cellphone: savedEmployee.cellphone,
          department: savedEmployee.department?.name ?? null,
          position: savedEmployee.employeePosition?.name ?? null,
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

  async updateCompany(companyData: ICompanyDetail): Promise<ICompanyDetail> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let currentStep = 'initial';
    emptyStringToNull(companyData.company);
    emptyStringToNull(companyData.address);
    emptyStringToNull(companyData.employee);
    try {
      const companyRepository = queryRunner.manager.getRepository(Company);
      const addressRepository = queryRunner.manager.getRepository(Address);
      const employeeRepository = queryRunner.manager.getRepository(Employee);
      const departmentRepository = queryRunner.manager.getRepository(Department);
      const employeePositionRepository = queryRunner.manager.getRepository(EmployeePosition);

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

      const departament = await departmentRepository.findOne({
        where: { name: (companyData.employee.department || '').trim() },
      });

      currentStep = 'getting-employee-position';

      const employeePosition = await employeePositionRepository.findOne({
        where: { name: (companyData.employee.position || '').trim() },
      });

      currentStep = 'saving-employee';
      const employeeData: Employee = {
        idEmployee: companyData.employee.idEmployee,
        isDefault: companyData.employee.isDefault,
        name: companyData.employee.name,
        cpf: companyData.employee.cpf,
        cellphone: companyData.employee.cellphone,
        email: companyData.employee.email,
        deskphone: companyData.employee.deskphone,
        department: departament,
        employeePosition: employeePosition,
      };

      const employeeToBeUpdated = employeeRepository.create(employeeData);
      const updatedEmployee = await queryRunner.manager.save(employeeToBeUpdated);

      await queryRunner.commitTransaction();
      return {
        company: updatedCompany,
        address: {
          idAddress: updatedAddress.idAddress,
          address: updatedAddress.address,
          number: updatedAddress.number,
          postalCode: updatedAddress.postalCode,
          complement: updatedAddress.complement,
          city: updatedAddress.city,
          district: updatedAddress.district,
          state: updatedAddress.state,
        },
        employee: {
          idEmployee: updatedEmployee.idEmployee,
          isDefault: updatedEmployee.isDefault,
          name: updatedEmployee.name,
          cpf: updatedEmployee.cpf,
          email: updatedEmployee.email,
          deskphone: updatedEmployee.deskphone,
          photoUrl: updatedEmployee.photoUrl,
          cellphone: updatedEmployee.cellphone,
          department: updatedEmployee.department?.name ?? null,
          position: updatedEmployee.employeePosition?.name ?? null,
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
