import { Company } from '@models/company/company';
import { injectable } from 'tsyringe';
import { Brackets, QueryRunner } from 'typeorm';
import { ICompany, ICompanyRegister } from '@src/core/interfaces/company.interface';
import { emptyStringToNull } from '@src/utils/misc';
import { dataSource } from '@src/config/data-source.config';
import { NextFunction } from 'express';
import { Address } from '@src/models/address/address';
import { Employee } from '@src/models/employee/employee';

@injectable()
export class CompanyRepository {
  private companyRepository = dataSource.getRepository(Company);
  private addressRepository = dataSource.getRepository(Address);
  private employeeRepository = dataSource.getRepository(Employee);

  async getCompanies(): Promise<Company[]> {
    const query = this.companyRepository
      .createQueryBuilder('company')
      .orderBy('company.idCompany', 'DESC');
    return query.getMany();
  }

  // async getCompanies(
  //   page: number,
  //   limit: number,
  //   input: string,
  //   select: string,
  //   type: number,
  // ): Promise<{ companies: Company[]; totalPages: number }> {
  //   let companiesQuery = null;
  //   const query = this.companyRepository
  //     .createQueryBuilder('company')
  //     .where('company.type = :type', { type: type })
  //     .orderBy('company.idCompany', 'DESC');
  //   if (input != null || input.length > 0) {
  //     query.andWhere(`LOWER(TRIM(company.${select})) LIKE LOWER(TRIM(:value))`, {
  //       value: `%${input}%`,
  //     });
  //   }
  //   companiesQuery = await query
  //     .limit(limit)
  //     .offset((page - 1) * limit)
  //     .getMany();
  //   const total = await query.getCount();
  //   const totalPages = Math.ceil(total / limit);
  //   return { companies: companiesQuery, totalPages };
  // }

  async findCompanyByField(field: keyof Company, value: string | number): Promise<Company> {
    return await this.companyRepository.findOne({
      where: { [field]: value },
    });
  }

  async checkExistingRegister(data: ICompany): Promise<Company | null> {
    emptyStringToNull(data);
    const query = this.companyRepository
      .createQueryBuilder('company')
      .where('company.type = :type', { type: data.type })
      .andWhere(
        new Brackets(qb => {
          qb.where('company.nickname = :nickname', { nickname: data.nickname })
            .orWhere('company.name = :name', { name: data.name })
            .orWhere('company.cnpj = :cnpj', { cnpj: data.cnpj });
          if (data.ie && data.ie.length > 0) {
            qb.orWhere('company.ie = :ie AND company.ie IS NOT NULL', { ie: data.ie });
          }
          if (data.im && data.im.length > 0) {
            qb.orWhere('company.im = :im AND company.im IS NOT NULL', { im: data.im });
          }
        }),
      );
    return query.getOne();
  }

  async saveCompany(companyData: ICompanyRegister, next: NextFunction): Promise<ICompanyRegister> {
    const queryRunner: QueryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const company = await queryRunner.manager.save(
        this.companyRepository.create(companyData.company),
      );
      const address = this.addressRepository.create(companyData.address);
      address.company = company;
      const savedAddress = await queryRunner.manager.save(address);
      const employee = this.employeeRepository.create(companyData.employee);
      employee.company = company;
      const savedEmployee = await queryRunner.manager.save(employee);
      await queryRunner.commitTransaction();
      return { company: company, address: savedAddress, employee: savedEmployee };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      next(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCompany(idCompany: number): Promise<void> {
    await this.companyRepository.delete(idCompany);
  }
}
