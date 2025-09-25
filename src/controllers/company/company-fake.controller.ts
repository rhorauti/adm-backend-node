import { CompanyRepository } from '@repositories/company/company.respository';
import { ICompanyDetail } from '@core/interfaces/company.interface';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import { Company } from '@models/company/company.model';

@injectable()
export class CompanyFakeController {
  constructor(
    @inject(TOKENS.CompanyRepository) private companyRepository: CompanyRepository,
    @inject(TOKENS.CompanyBaseRepository) private baseRepository: BaseRepository<Company>,
    @inject(TOKENS.ApiResponse) private apiResponse: ApiResponse,
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

  randomCompany: ICompanyDetail = {
    company: {
      idCompany: null,
      nickname: '',
      name: '',
      cnpj: '',
      ie: '',
      im: '',
    },
    address: {
      idAddress: null,
      postalCode: '',
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
    },
    employee: {
      idEmployee: null,
      isDefault: false,
      name: '',
      cpf: '',
      email: '',
      deskphone: '',
      cellphone: '',
    },
  };

  async addRandomRegisters(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const registersNumber = 30;
      const baseTimestamp = Date.now();
      for (let i = 0; i < registersNumber; i++) {
        const uniqueId = `${baseTimestamp}${i}`;
        this.randomCompany.company.idCompany = 0;
        this.randomCompany.company.name = this.setRandomNameAndNickName() + uniqueId;
        this.randomCompany.company.nickname = this.setRandomNameAndNickName() + uniqueId;
        this.randomCompany.company.cnpj = this.setRandomCnpjOrIeOrIm();
        this.randomCompany.company.ie = this.setRandomCnpjOrIeOrIm(8);
        this.randomCompany.company.im = this.setRandomCnpjOrIeOrIm(10);
        await this.companyRepository.addCompany(this.randomCompany);
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
      const companies = await this.baseRepository.getDataList('idCompany');
      companies.forEach(async company => {
        await this.baseRepository.delete(company.idCompany);
      });
      return response.json({
        message: `Todas as ${companies.length} empresas excluidas com sucesso.`,
      });
    } catch (error) {
      next(error);
    }
  }
}
