import { Company } from '@models/company/company';
import { inject, injectable } from 'tsyringe';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ICompany, ICompanyRegister } from '@core/interfaces/company.interface';
import { emptyStringToNull } from '@utils/misc';
import { Response, NextFunction } from 'express';
import { Address } from '@models/address/address';
import { Employee } from '@models/employee/employee';
import { ApiResponse } from '@utils/api-response';
import { CustomError } from '@middlewares/error';

@injectable()
export class CompanyRepository {
  private companyRepository: Repository<Company>;
  private addressRepository: Repository<Address>;
  private employeeRepository: Repository<Employee>;

  constructor(
    @inject('DataSource') private dataSource: DataSource,
    @inject('ApiResponse') private apiResponse: ApiResponse,
  ) {
    this.companyRepository = this.dataSource.getRepository(Company);
    this.addressRepository = this.dataSource.getRepository(Address);
    this.employeeRepository = this.dataSource.getRepository(Employee);
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

  // async checkExistingRegister(data: ICompany): Promise<Company | null> {
  //   emptyStringToNull(data);
  //   const query = this.companyRepository
  //     .createQueryBuilder('company')
  //     .where('company.type = :type', { type: data.type })
  //     .andWhere(
  //       new Brackets(qb => {
  //         qb.where('company.nickname = :nickname', { nickname: data.nickname })
  //           .orWhere('company.name = :name', { name: data.name })
  //           .orWhere('company.cnpj = :cnpj', { cnpj: data.cnpj });
  //         if (data.ie && data.ie.length > 0) {
  //           qb.orWhere('company.ie = :ie AND company.ie IS NOT NULL', { ie: data.ie });
  //         }
  //         if (data.im && data.im.length > 0) {
  //           qb.orWhere('company.im = :im AND company.im IS NOT NULL', { im: data.im });
  //         }
  //       }),
  //     );
  //   return query.getOne();
  // }

  async addCompany(companyData: ICompanyRegister): Promise<ICompanyRegister> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      emptyStringToNull(companyData.company);
      emptyStringToNull(companyData.address);
      emptyStringToNull(companyData.employee);
      const company = this.companyRepository.create(companyData.company);
      const savedCompany = await queryRunner.manager.save(company);
      const address = this.addressRepository.create(companyData.address);
      address.company = savedCompany;
      const savedAddress = await queryRunner.manager.save(address);
      const employee = this.employeeRepository.create(companyData.employee);
      employee.company = savedCompany;
      const savedEmployee = await queryRunner.manager.save(employee);
      await queryRunner.commitTransaction();
      return { company: savedCompany, address: savedAddress, employee: savedEmployee };
    } catch (error) {
      const customError = error as CustomError;
      await queryRunner.rollbackTransaction();
      if (error && error.code == 'ER_DUP_ENTRY') {
        customError.statusCode = 409;
        if (error.message.includes('UQ_company_name')) {
          customError.message = 'O nome da empresa já existe e não pode estar duplicado.';
        } else if (error.message.includes('UQ_company_nickname')) {
          customError.message = 'O Nome Fantasia da empresa já existe e não pode estar duplicado.';
        } else if (error.message.includes('UQ_company_cnpj')) {
          customError.message = 'O CNPJ/CPF da empresa já existe e não pode estar duplicado.';
        } else if (error.message.includes('UQ_company_ie')) {
          customError.message =
            'A Inscrição Estadual da empresa já existe e não pode estar duplicado.';
        } else if (error.message.includes('UQ_company_im')) {
          customError.message =
            'A Inscrição Municipal da empresa já existe e não pode estar duplicado.';
        }
      }
      throw customError;
    } finally {
      await queryRunner.release();
    }
  }

  async updateCompany(
    companyData: ICompanyRegister,
    response: Response,
    next: NextFunction,
  ): Promise<ICompanyRegister> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      emptyStringToNull(companyData.company);
      emptyStringToNull(companyData.address);
      emptyStringToNull(companyData.employee);
      const existingCompany = await queryRunner.manager.findOne(Company, {
        where: { idCompany: companyData.company.idCompany },
      });
      const existingAddress = await queryRunner.manager.findOne(Address, {
        where: { company: { idCompany: companyData.company.idCompany } },
      });
      const existingEmployee = await queryRunner.manager.findOne(Employee, {
        where: { company: { idCompany: companyData.company.idCompany } },
      });
      if (!existingCompany) {
        this.apiResponse.Error(response, 404, 'Empresa não encontrada.');
      } else if (!existingAddress) {
        this.apiResponse.Error(response, 404, 'Endereço relacionado a empresa não encontrada.');
      } else if (!existingEmployee) {
        this.apiResponse.Error(response, 404, 'Contato relacionado a empresa não encontrada.');
      } else {
        const updatedCompany = queryRunner.manager.merge(
          Company,
          existingCompany,
          companyData.company,
        );
        const updatedAddress = queryRunner.manager.merge(
          Address,
          existingAddress,
          companyData.address,
        );
        const updatedEmployee = queryRunner.manager.merge(
          Employee,
          existingEmployee,
          companyData.employee,
        );
        await Promise.all([
          queryRunner.manager.save(updatedCompany),
          queryRunner.manager.save(updatedAddress),
          queryRunner.manager.save(updatedEmployee),
        ]);
        await queryRunner.commitTransaction();
        return { company: updatedCompany, address: updatedAddress, employee: updatedEmployee };
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      next(error);
    } finally {
      await queryRunner.release();
    }
  }

  async saveCompany(company: ICompany): Promise<ICompany> {
    return await this.companyRepository.save(company);
  }

  async deleteCompany(idCompany: number): Promise<void> {
    await this.companyRepository.delete(idCompany);
  }
}
