import { CompanyRepository } from '@repositories/company.respository';
import { Request, Response } from 'express';

export class CompanyController {
  constructor(private companyRepository: CompanyRepository) {}

  async getCompanyList(request: Request, response: Response): Promise<Response> {
    const companiesList = await this.companyRepository.getCompanyList(request.body.tipoEmpresa);
    companiesList.sort((a, b) => {
      if (a.id > b.id) {
        return -1;
      }
    });
    if (!companiesList) {
      return response.status(400).json({
        status: false,
        message: 'Nenhum registro encontrando!',
      });
    } else {
      return response.status(200).json({
        status: true,
        message: 'Lista recebida com sucesso!',
        data: companiesList,
      });
    }
  }

  async addNewCompany(request: Request, response: Response): Promise<Response> {
    const company = await this.companyRepository.findCompanyByName(request.body.name);
    if (company) {
      return response.status(401).json({
        status: false,
        message: `Empresa ${company.name} já existe!`,
      });
    } else {
      const newCompany = await this.companyRepository.addNewCompany(request.body);
      if (!newCompany) {
        return response.status(500).json({
          status: false,
          message: 'Erro interno do servidor!',
        });
      } else {
        return response.status(200).json({
          status: true,
          message: `Empresa ${newCompany.name} registrada com sucesso!`,
          data: newCompany,
        });
      }
    }
  }

  async updateCompany(request: Request, response: Response): Promise<Response> {
    const customer = await this.companyRepository.findCompanyById(Number(request.params.id));
    if (!customer) {
      return response.status(400).json({
        status: false,
        message: 'Empresa não encontrada!',
      });
    } else {
      await this.companyRepository.updateCompany(request.body, request.params.id);
      return response.status(200).json({
        status: true,
        message: `Empresa ${request.body.nome} alterada com sucesso!`,
      });
    }
  }

  async deleteCustomer(request: Request, response: Response): Promise<Response> {
    const company = await this.companyRepository.findCompanyById(Number(request.params.id));
    if (!company) {
      return response.status(400).json({
        status: false,
        message: 'Empresa não encontranda!',
      });
    } else {
      await this.companyRepository.deleteCompany(request.params.id);
      return response.status(200).json({
        status: true,
        message: `Empresa ${company.name} excluida com sucesso!`,
      });
    }
  }
}