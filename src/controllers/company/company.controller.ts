import { CompanyRepository } from '@repositories/company/company.respository';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CompanyController {
  constructor(@inject('CompanyRepository') private companyRepository: CompanyRepository) {}

  async getCompanyList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { page, limit, input, select } = request.query;
      const companies = await this.companyRepository.getCompanies(
        Number(page),
        Number(limit),
        input.toString(),
        select.toString(),
      );
      return response.status(200).json({
        date: new Date(),
        status: true,
        msg: 'Lista recebida com sucesso!',
        data: companies,
      });
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

  async saveCompany(request: Request, response: Response, next: NextFunction): Promise<Response> {
    try {
      const message = await this.checkExistingCompany(request, next);
      console.log('message', message);
      if (message && message.length > 0) {
        return response.status(400).json({
          status: false,
          msg: message,
        });
      } else {
        console.log('entrando no savedCompany...');
        await this.companyRepository.saveCompany(request.body);
        return response.status(200).json({
          status: true,
          msg: 'Empresa salva com sucesso!',
        });
      }
    } catch (e) {
      console.log(e.error.msg);
      next(e);
    }
  }

  async checkExistingCompany(request: Request, next: NextFunction): Promise<string> {
    try {
      const { nickname, name, cnpj, ie, im, idCompany } = request.body;
      const company = await this.companyRepository.checkExistingRegister(request.body);
      let msg = null;
      if (company && company.idCompany != idCompany) {
        if (company.nickname.trim().toLowerCase() == nickname.trim().toLowerCase()) {
          msg = `Esse apelido ${nickname} já existe!`;
        } else if (company.name.trim().toLowerCase() == name.trim().toLowerCase()) {
          msg = `Esse nome ${name} já existe!`;
        } else if (company.cnpj.trim() == cnpj.trim()) {
          msg = `Esse cnpj ${cnpj} já existe!`;
        } else if (company.ie.trim() == ie.trim()) {
          msg = `Essa Inscrição Estadual ${ie} já existe!`;
        } else if (company.im.trim() == im.trim()) {
          msg = `Essa Inscrição Municipal ${im} já existe!`;
        }
      }
      return msg;
    } catch (error) {
      next(error);
    }
  }

  async deleteCompany(request: Request, response: Response, next: NextFunction): Promise<Response> {
    const companies = request.body;
    try {
      companies.forEach(async companyData => {
        await this.companyRepository.deleteCompany(companyData.idCompany);
      });
      return response.status(200).json({
        status: true,
        msg: `${companies.length == 1 ? companies[0].name : 'Empresas'} excluida(s) com sucesso!`,
      });
    } catch (error) {
      next(error);
    }
  }
}
