import { CompanyRepository } from '@repositories/company/company.respository';
import { ICompany, ICompanyRegister, ICompanyResponse } from '@core/interfaces/company.interface';
import { Company } from '@models/company/company';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CustomError } from '@middlewares/error';

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

  async saveCompany(
    request: Request<unknown, unknown, ICompanyRegister>,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ICompanyResponse>> {
    try {
      if (
        request.body.company.idCompany == 0 ||
        request.body.company.idCompany == undefined ||
        request.body.company.idCompany == null
      ) {
        const company = await this.companyRepository.addCompany(request.body);
        return this.apiResponse.Ok<ICompanyRegister>(
          response,
          200,
          'Empresa adicionada com sucesso.',
          company,
        );
      } else {
        const company = await this.companyRepository.updateCompany(request.body);
        if (company) {
          return this.apiResponse.Ok(response, 200, 'Empresa salva com sucesso.', company);
        }
      }
    } catch (error) {
      const customError = error as CustomError;
      if ((error && error.code == 'ER_DUP_ENTRY') || error?.code === '23505') {
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
        return this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else {
        const step = typeof customError.step == 'string' ? customError.step : '';
        switch (step) {
          case 'saving-company':
            customError.message =
              'Erro interno ao salvar os dados da empresa. Tente novamente mais tarde.';
            break;
          case 'finding-company':
            customError.message =
              'Erro interno ao procurar os dados existentes da empresa. Tente novamente mais tarde.';
            break;
          case 'saving-address':
            customError.message =
              'Erro interno ao salvar os dados do endereço da empresa. Tente novamente mais tarde.';
            break;
          case 'finding-address':
            customError.message =
              'Erro interno ao procurar os dados existentes de endereço. Tente novamente mais tarde.';
            break;
          case 'saving-employee':
            customError.message =
              'Erro interno ao salvar os dados do funcionário. Tente novamente mais tarde.';
            break;
          case 'finding-employee':
            customError.message =
              'Erro interno ao procurar os dados existentes do funcionário. Tente novamente mais tarde.';
            break;
          case 'finding-department':
            customError.message =
              'Erro interno ao procurar os dados existentes do departamento do funcionário. Tente novamente mais tarde.';
            break;
          case 'finding-employee-position':
            customError.message =
              'Erro interno ao procurar os dados existentes do cargo do funcionário. Tente novamente mais tarde.';
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

  setRandomNameAndNickName(): string {
    const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
    const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
    const id = Math.floor(Math.random());
    return `${prefix} ${suffix} ${id}`;
  }

  setRandomCnpjOrIeOrIm(length = 14): string {
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
        company: {
          idCompany: 0,
          name: '',
          nickname: '',
          cnpj: '',
          ie: '',
          im: '',
        },
        address: {
          idAddress: 0,
          postalCode: '',
          address: '',
          complement: '',
          number: '',
          district: '',
          city: '',
          state: '',
        },
        employee: {
          idEmployee: 0,
          isDefault: false,
          name: '',
          cellphone: '',
          cpf: '',
          department: '',
          deskphone: '',
          email: '',
          position: '',
        },
      } as ICompanyRegister;
      for (let i = 0; i < registersNumber; i++) {
        const uniqueId = `${baseTimestamp}${i}`;
        randomCompany.company.idCompany = 0;
        randomCompany.company.name = this.setRandomNameAndNickName() + uniqueId;
        randomCompany.company.nickname = this.setRandomNameAndNickName() + uniqueId;
        randomCompany.company.cnpj = this.setRandomCnpjOrIeOrIm();
        randomCompany.company.ie = this.setRandomCnpjOrIeOrIm(8);
        randomCompany.company.im = this.setRandomCnpjOrIeOrIm(10);
        await this.companyRepository.addCompany(randomCompany);
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
