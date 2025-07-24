import { CompanyRepository } from '@repositories/company/company.respository';
import {
  ICompany,
  ICompanyRegister,
  IResponseCompany,
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
    response: Response<IResponseCompany>,
    next: NextFunction,
  ): Promise<Response<IResponseCompany>> {
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
    response: Response<IResponseCompany>,
    next: NextFunction,
  ): Promise<Response<IResponseCompany>> {
    try {
      const existingCompany = await this.companyRepository.findCompanyByField(
        'idCompany',
        request.body.company.idCompany,
      );
      const errorMessage = this.checkExistingCompany(existingCompany);
      if (errorMessage.length > 0) {
        this.apiResponse.Error(response, 409, errorMessage);
      } else {
        const company = await this.companyRepository.saveCompany(request.body, next);
        return this.apiResponse.Ok<ICompanyRegister>(
          response,
          200,
          'Empresa salva com sucesso!',
          company,
        );
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
        errorMessage = `Esse cnpj ${cnpj} já existe!`;
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
    response: Response<IResponseCompany>,
    next: NextFunction,
  ): Promise<Response<IResponseCompany>> {
    try {
      const company = await this.companyRepository.findCompanyByField(
        'idCompany',
        Number(request.params.idCompany),
      );
      await this.companyRepository.deleteCompany(company.idCompany);
      return this.apiResponse.Ok(response, 200, `Empresa ${company.name} excluida com sucesso!`);
    } catch (error) {
      next(error);
    }
  }
}
