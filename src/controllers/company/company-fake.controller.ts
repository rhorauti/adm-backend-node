import { CompanyRepository } from '@repositories/company/company.respository';
import { ICompanyDetail, ICompanyResponse } from '@core/interfaces/company.interface';
import { Company } from '@models/company/company.model';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CustomError } from '@middlewares/error.middleware';

@injectable()
export class CompanyFakeController {
  constructor(
    @inject('CompanyRepository') private companyRepository: CompanyRepository,
    @inject('ApiResponse') private apiResponse: ApiResponse,
  ) {}

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
      } as ICompanyDetail;
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
