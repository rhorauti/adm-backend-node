import { CompanyRepository } from '@repositories/company/company.respository';
import { ICompanyDetail, ICompanyResponse } from '@core/interfaces/company.interface';
import { Company } from '@models/company/company.model';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CustomError } from '@middlewares/error.middleware';
import { TOKENS } from '@containers/symbol';

@injectable()
export class CompanyController {
  constructor(
    @inject(TOKENS.CompanyRepository) private companyRepository: CompanyRepository,
    @inject(TOKENS.ApiResponse) private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'empresas';
  keyId = 'idCompany';
  routeNameTranslatedSingular = 'da ' + this.routeNameTranslated.slice(0, -1);

  async getCompanyInfo(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    const id = Number(request.params[this.keyId]);
    try {
      const data = await this.companyRepository.findCompanyByField({ [this.keyId]: id });
      if (data) {
        return this.apiResponse.Ok<Company>(
          response,
          200,
          `Detalhes ${this.routeNameTranslatedSingular} recebida com sucesso!`,
          data,
        );
      } else {
        return this.apiResponse.Error(
          response,
          500,
          `Falha interna ao pegar as informações ${this.routeNameTranslatedSingular}.`,
        );
      }
    } catch (error) {
      next(error);
    }
  }

  async getCompanyCompleteInfo(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const id = Number(request.params[this.keyId]);
      const data = await this.companyRepository.getCompanyCompleteInfo(id);
      if (data) {
        return this.apiResponse.Ok<ICompanyDetail>(
          response,
          200,
          `Detalhes ${this.routeNameTranslatedSingular} recebida com sucesso!`,
          data,
        );
      } else {
        return this.apiResponse.Error(
          response,
          500,
          `Falha interna ao pegar as informações ${this.routeNameTranslatedSingular}.`,
        );
      }
    } catch (error) {
      const customError = error as CustomError;
      const step = typeof customError.step == 'string' ? customError.step : '';
      switch (step) {
        case 'getting-company':
          customError.message = `Erro interno ao procurar os dados existentes ${this.routeNameTranslatedSingular}. Tente novamente mais tarde.`;
          break;
        case 'getting-address':
          customError.message = `Erro interno ao procurar os dados do endereço ${this.routeNameTranslatedSingular}. Tente novamente mais tarde.`;
          break;
        case 'getting-employee':
          customError.message =
            'Erro interno ao procurar os dados do funcionário. Tente novamente mais tarde.';
          break;
        case 'getting-department':
          customError.message =
            'Erro interno ao procurar os dados do departamento. Tente novamente mais tarde.';
          break;
        case 'getting-employee-position':
          customError.message =
            'Erro interno ao procurar os dados do cargo. Tente novamente mais tarde.';
          break;
        default:
          customError.message = 'Erro interno inesperado. Tente novamente mais tarde.';
      }
      next(customError);
    }
  }

  async getCompanyList(
    request: Request,
    response: Response,
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
        return this.apiResponse.Error(response, 500, `Falha ao listar ${this.routeNameTranslated}`);
      }
    } catch (error) {
      next(error);
    }
  }

  async saveCompany(
    request: Request<unknown, unknown, ICompanyDetail>,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ICompanyResponse>> {
    try {
      if (
        request.body.company[this.keyId] == 0 ||
        request.body.company[this.keyId] == undefined ||
        request.body.company[this.keyId] == null
      ) {
        const data = await this.companyRepository.addCompany(request.body);
        return this.apiResponse.Ok<ICompanyDetail>(
          response,
          200,
          `Dados do(a) ${this.routeNameTranslatedSingular} adicionada com sucesso.`,
          data,
        );
      } else {
        const data = await this.companyRepository.updateCompany(request.body);
        if (data) {
          return this.apiResponse.Ok(
            response,
            200,
            `Dados do(a) ${this.routeNameTranslatedSingular} salvos com sucesso.`,
            data,
          );
        }
      }
    } catch (error) {
      const customError = error as CustomError;
      if ((error && error.code == 'ER_DUP_ENTRY') || error?.code === '23505') {
        customError.statusCode = 409;
        if (error.message.includes('UQ_company_name')) {
          customError.message = `O nome da ${this.routeNameTranslatedSingular} já existe e não pode estar duplicado.`;
        } else if (error.message.includes('UQ_company_nickname')) {
          customError.message = `O Nome Fantasia da ${this.routeNameTranslatedSingular} já existe e não pode estar duplicado.`;
        } else if (error.message.includes('UQ_company_cnpj')) {
          customError.message = `O CNPJ/CPF ${this.routeNameTranslatedSingular} já existe e não pode estar duplicado.`;
        } else if (error.message.includes('UQ_company_ie')) {
          customError.message = `A Inscrição Estadual ${this.routeNameTranslatedSingular} já existe e não pode estar duplicado.`;
        } else if (error.message.includes('UQ_company_im')) {
          customError.message = `A Inscrição Municipal ${this.routeNameTranslatedSingular} já existe e não pode estar duplicado.`;
        }
      } else if (error.message?.includes('UQ_employee_cpf')) {
        customError.message = 'Já existe um funcionário com esse CPF.';
      } else if (error.message?.includes('UQ_employee_name')) {
        customError.message = 'Já existe um funcionário com esse nome.';
        return this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else {
        const step = typeof customError.step == 'string' ? customError.step : '';
        switch (step) {
          case 'saving-company':
            customError.message = `Erro interno ao salvar os dados ${this.routeNameTranslatedSingular}. Tente novamente mais tarde.`;
            break;
          case 'getting-company':
            customError.message = `Erro interno ao procurar os dados ${this.routeNameTranslatedSingular}. Tente novamente mais tarde.`;
            break;
          case 'saving-address':
            customError.message = `Erro interno ao salvar os dados do endereço ${this.routeNameTranslatedSingular}. Tente novamente mais tarde.`;
            break;
          case 'getting-address':
            customError.message =
              'Erro interno ao procurar os dados do endereço. Tente novamente mais tarde.';
            break;
          case 'saving-employee':
            customError.message =
              'Erro interno ao salvar os dados do funcionário. Tente novamente mais tarde.';
            break;
          case 'getting-employee':
            customError.message =
              'Erro interno ao procurar os dados do funcionário. Tente novamente mais tarde.';
            break;
          case 'getting-department':
            customError.message =
              'Erro interno ao procurar os dados do departamento. Tente novamente mais tarde.';
            break;
          case 'getting-employee-position':
            customError.message =
              'Erro interno ao procurar os dados do cargo. Tente novamente mais tarde.';
            break;
          default:
            customError.message = 'Erro interno inesperado. Tente novamente mais tarde.';
        }
      }
      next(customError);
    }
  }

  async deleteCompany(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ICompanyResponse>> {
    try {
      const data = await this.companyRepository.findCompanyByField({
        [this.keyId]: Number(request.params[this.keyId]),
      });
      await this.companyRepository.deleteCompany(data[this.keyId]);
      return this.apiResponse.Ok(
        response,
        200,
        `Dados ${this.routeNameTranslatedSingular} ${data.name} excluida com sucesso!`,
      );
    } catch (error) {
      next(error);
    }
  }
}
