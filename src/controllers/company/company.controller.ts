import { CompanyRepository } from '@repositories/company/company.respository';
import {
  ICompany,
  ICompanyRegister,
  ICompanyResponse,
} from '@src/core/interfaces/company.interface';
import { Company } from '@src/models/company/company';
import { ApiResponse } from '@src/utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

export interface DeleteCompanyParams {
  idCompany: string;
}

@injectable()
export class CompanyController {
  constructor(
    @inject('CompanyRepository') private companyRepository: CompanyRepository,
    @inject('ApiResponse') private apiResponse: ApiResponse,
  ) {}

  async getCompanyList(
    request: Request<ICompany>,
    response: Response<ICompanyResponse>,
    next: NextFunction,
  ): Promise<Response<ICompanyResponse>> {
    try {
      const companies = await this.companyRepository.getCompanies();
      if (companies) {
        return this.apiResponse.Ok<Company[]>(
          response,
          200,
          'Lista recebida com sucesso!',
          companies,
        );
      } else {
        return this.apiResponse.Error(response, 500, 'Falha ao listar as empresas.');
      }
    } catch (error) {
      next(error);
    }
  }

  // async addNewCompany(
  //   request: Request,
  //   response: Response,
  //   next: NextFunction,
  // ): Promise<Response | void> {
  //   const queryRunner: QueryRunner = dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     const { nickname, name, cnpj, ie, im, type } = request.body;

  //     const existingCompany = await queryRunner.manager
  //       .createQueryBuilder(Company, 'company')
  //       .where(
  //         new Brackets(qb => {
  //           qb.where('company.nickname = :nickname', {
  //             nickname: nickname,
  //           }).andWhere('company.type = :type', { type: type });
  //         }),
  //       )
  //       .orWhere(
  //         new Brackets(qb => {
  //           qb.where('company.name = :name', { name: name }).andWhere('company.type = :type', {
  //             type: type,
  //           });
  //         }),
  //       )
  //       .orWhere(
  //         new Brackets(qb => {
  //           qb.where('company.cnpj = :cnpj', { cnpj: cnpj }).andWhere('company.type = :type', {
  //             type: type,
  //           });
  //         }),
  //       )
  //       .orWhere(
  //         new Brackets(qb => {
  //           qb.where('company.ie = :ie', { ie: ie })
  //             .andWhere('company.type = :type', {
  //               type: type,
  //             })
  //             .andWhere('company.ie <> ""');
  //         }),
  //       )
  //       .orWhere(
  //         new Brackets(qb => {
  //           qb.where('company.im = :im', { im: im })
  //             .andWhere('company.type = :type', {
  //               type: type,
  //             })
  //             .andWhere('company.ie <> ""');
  //         }),
  //       )
  //       .getOne();
  //     if (existingCompany) {
  //       await queryRunner.rollbackTransaction();
  //       let msg = 'A empresa já existe com o mesmo ';
  //       if (existingCompany.nickname.trim().toLowerCase() == nickname.trim().toLowerCase())
  //         msg += `nickname: ${existingCompany.nickname}`;
  //       else if (existingCompany.name.trim().toLowerCase() == name.trim().toLowerCase())
  //         msg += `nome: ${existingCompany.name}`;
  //       else if (existingCompany.cnpj.trim().toLowerCase() == cnpj.trim().toLowerCase())
  //         msg += `CNPJ: ${existingCompany.cnpj}`;
  //       else if (existingCompany.ie.trim().toLowerCase() == ie.trim().trim().toLowerCase())
  //         msg += `Inscrição Estadual: ${existingCompany.ie}`;
  //       else if (existingCompany.im.trim().toLowerCase() == im.trim().toLowerCase())
  //         msg += `Inscrição Municipal: ${existingCompany.im}`;
  //       const error = new Error(msg) as CustomError;
  //       error.statusCode = 400;
  //       return next(error);
  //     }
  //     if (ie == '') request.body.ie = null;
  //     if (im == '') request.body.im = null;

  //     const company = queryRunner.manager.create(Company, request.body);
  //     const savedCompany = await queryRunner.manager.save(company);

  //     await queryRunner.commitTransaction();

  //     return response.status(200).json({
  //       status: true,
  //       msg: `Empresa ${savedCompany.name} registrada com sucesso!`,
  //       data: savedCompany,
  //     });
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     return next(error);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async saveCompany(
    request: Request<unknown, unknown, ICompanyRegister>,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ICompanyResponse>> {
    try {
      if (request.body.company.idCompany == 0) {
        const company = await this.companyRepository.addCompany(request.body);
        return this.apiResponse.Ok<ICompanyRegister>(
          response,
          200,
          'Empresa adicionada com sucesso.',
          company,
        );
      } else {
        const company = await this.companyRepository.updateCompany(request.body, response, next);
        if (company) {
          return this.apiResponse.Ok(response, 200, 'Empresa salva com sucesso.', company);
        }
      }
    } catch (error) {
      next(error);
    }
  }

  checkExistingCompany(company: Company): string {
    let errorMessage = '';
    if (company == null) return (errorMessage = '');
    else {
      const { nickname, name, cnpj, ie, im } = company;
      if (company.nickname.trim().toLowerCase() == nickname.trim().toLowerCase()) {
        errorMessage = `Esse apelido ${nickname} já existe!`;
      } else if (company.name.trim().toLowerCase() == name.trim().toLowerCase()) {
        errorMessage = `Esse nome ${name} já existe!`;
      } else if (company.cnpj.trim() == cnpj.trim()) {
        errorMessage = `Esse CNPJ/CPF ${cnpj} já existe!`;
      } else if (company.ie.trim() == ie.trim()) {
        errorMessage = `Essa Inscrição Estadual ${ie} já existe!`;
      } else if (company.im.trim() == im.trim()) {
        errorMessage = `Essa Inscrição Municipal ${im} já existe!`;
      }
      return errorMessage;
    }
  }

  async deleteCompany(
    request: Request<DeleteCompanyParams>,
    response: Response<ICompanyResponse>,
    next: NextFunction,
  ): Promise<Response<ICompanyResponse>> {
    try {
      const company = await this.companyRepository.findCompanyByField({
        idCompany: Number(request.params.idCompany),
      });
      await this.companyRepository.deleteCompany(company.idCompany);
      return this.apiResponse.Ok(response, 200, `Empresa ${company.name} excluida com sucesso!`);
    } catch (error) {
      next(error);
    }
  }

  prefixes = [
    'Blue',
    'Green',
    'Red',
    'Silver',
    'Golden',
    'Bright',
    'Quantum',
    'Neo',
    'Next',
    'Future',
    'Nova',
    'Apex',
    'Zenith',
    'Hyper',
    'Meta',
    'Omni',
    'Eco',
    'Cyber',
    'Fusion',
    'Vertex',
    'Alpha',
    'Beta',
    'Lunar',
    'Solar',
    'Urban',
    'Velocity',
    'Cloud',
    'Net',
    'Digital',
    'Smart',
    'Infinity',
    'Dynamic',
    'Synergy',
  ];

  suffixes = [
    'Solutions',
    'Systems',
    'Technologies',
    'Enterprises',
    'Group',
    'Corp',
    'LLC',
    'Inc',
    'Studios',
    'Labs',
    'Works',
    'Networks',
    'Industries',
    'Holdings',
    'Partners',
    'Consulting',
    'Software',
    'Media',
    'Logistics',
    'Innovations',
    'Ventures',
    'Designs',
    'Development',
    'Analytics',
    'Services',
    'Dynamics',
  ];

  getRandomNameAndNickName(): string {
    const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
    const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
    const id = Math.floor(Math.random());
    return `${prefix} ${suffix} ${id}`;
  }

  getRandomCnpjOrIeOrIm(length = 14): string {
    let cnpj = '';
    for (let i = 0; i < length; i++) {
      cnpj += Math.floor(Math.random() * 10);
    }
    return cnpj;
  }

  async addRandomRegisters(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const registersNumber = 30;
      const baseTimestamp = Date.now();
      const randomCompany = {
        idCompany: 0,
        name: '',
        nickname: '',
        cnpj: '',
        ie: '',
        im: '',
      } as ICompany;
      for (let i = 0; i < registersNumber; i++) {
        const uniqueId = `${baseTimestamp}${i}`;
        randomCompany.idCompany = 0;
        randomCompany.name = this.getRandomNameAndNickName() + uniqueId;
        randomCompany.nickname = this.getRandomNameAndNickName() + uniqueId;
        randomCompany.cnpj = this.getRandomCnpjOrIeOrIm();
        randomCompany.ie = this.getRandomCnpjOrIeOrIm(8);
        randomCompany.im = this.getRandomCnpjOrIeOrIm(10);
        await this.companyRepository.saveCompany(randomCompany);
      }
      return response.json({
        message: `${registersNumber} registros de teste inseridos com sucesso!`,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAllRandomRegisters(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const companies = await this.companyRepository.getCompanies();
      companies.forEach(async company => {
        await this.companyRepository.deleteCompany(company.idCompany);
      });
      return response.json({
        message: `Todas as ${companies.length} empresas excluidas com sucesso.`,
      });
    } catch (error) {
      next(error);
    }
  }
}
