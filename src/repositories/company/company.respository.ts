import { dataSource } from '@src/migrations';
import { ICompanyDTO } from '../../core/interfaces/ICompany';
import { Company } from '@models/company/company';
import { injectable } from 'tsyringe';
import { Brackets } from 'typeorm';

@injectable()
export class CompanyRepository {
  private companyRepository = dataSource.getRepository(Company);

  async getCompanies(
    page: number,
    limit: number,
    input: string,
    select: string,
  ): Promise<{ companies: Company[]; totalPages: number }> {
    let companiesQuery = null;
    const query = this.companyRepository.createQueryBuilder('company');
    if (input != null || input.length > 0) {
      query.where(`LOWER(TRIM(company.${select})) LIKE LOWER(TRIM(:value))`, {
        value: `%${input}%`,
      });
    }
    companiesQuery = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .getMany();
    companiesQuery.sort((a, b) => {
      if (a.idCompany > b.idCompany) {
        return -1;
      }
    });
    const total = await query.getCount();
    const totalPages = Math.ceil(total / limit);
    return { companies: companiesQuery, totalPages };
  }

  async findCompanyByField(field: keyof Company, value: string | number): Promise<Company> {
    return await this.companyRepository.findOne({
      where: { [field]: value },
    });
  }

  async checkExistingRegister(data: ICompanyDTO): Promise<Company | null> {
    if (data.ie == '') data.ie = null;
    if (data.im == '') data.im = null;
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

  /**
   * addNewCompany
   * Adiciona uma nova empresa no banco de dados
   * @param companyData Objeto com os dados da empresa que será cadatrado.
   */
  async saveCompany(data: ICompanyDTO): Promise<Company> {
    return await this.companyRepository.save(data);
  }

  async deleteCompany(idCompany: number): Promise<void> {
    await this.companyRepository.delete(idCompany);
  }
}
