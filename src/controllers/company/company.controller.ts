import { CompanyRepository } from '@repositories/company/company.respository';
import { ICompanyForm, IResponseCompanyForm } from '@core/interfaces/company.interface';
import { Company } from '@models/company/company.model';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CustomError } from '@middlewares/error.middleware';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { Department } from '@models/department/department.model';
import { Employee } from '@models/employee/employee.model';
import { emptyToNullRecursive } from '@utils/misc';

@injectable()
export class CompanyController {
  constructor(
    @inject(TOKENS.CompanyRepository) private companyRepository: CompanyRepository,
    @inject(TOKENS.CompanyBaseRepository) private companyBaseRepository: BaseRepository<Company>,
    @inject(TOKENS.EmployeeBaseRepository) private employeeBaseRepository: BaseRepository<Employee>,
    @inject(TOKENS.DepartmentBaseRepository)
    private departmentBaseRepository: BaseRepository<Department>,
    @inject(TOKENS.EmployeePositionBaseRepository)
    private employeePositionBaseRepository: BaseRepository<EmployeePosition>,
    @inject(TOKENS.ApiResponse) private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'empresas';
  keyId = 'idCompany';
  routeNameTranslatedSingular = 'da ' + this.routeNameTranslated.slice(0, -1);

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IResponseCompanyForm>> {
    try {
      const companies = await this.companyBaseRepository.getDataList({
        order: { idCompany: 'DESC' },
      });
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

  async getData(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ICompanyForm>> {
    try {
      const idCompany = Number(request.params[this.keyId] || 0);
      let companyForm: ICompanyForm = null;
      const departmentDataList = await this.departmentBaseRepository.getDataList({
        select: { idDepartment: true, name: true },
        order: { idDepartment: 'DESC' },
      });
      const employeePositionList = await this.employeePositionBaseRepository.getDataList({
        select: { idEmployeePosition: true, name: true },
        order: { idEmployeePosition: 'DESC' },
      });
      if (idCompany == 0) {
        companyForm = {
          idCompany: null,
          name: '',
          nickname: '',
          cnpj: '',
          ie: '',
          im: '',
          address: {
            idAddress: null,
            address: '',
            city: '',
            complement: '',
            number: '',
            district: '',
            postalCode: '',
            state: '',
          },
          employee: [
            {
              idEmployee: null,
              isDefault: false,
              name: '',
              cellphone: '',
              deskphone: '',
              email: '',
              employeePosition: {
                idEmployeePosition: null,
                name: '',
              },
              department: {
                idDepartment: null,
                name: '',
              },
            },
          ],
          departmentList: departmentDataList,
          employeePositionList: employeePositionList,
        };
        return this.apiResponse.Ok(
          response,
          200,
          'Dados da empresa enviados com sucesso.',
          companyForm,
        );
      } else {
        const company = await this.companyRepository.getCompanyData(idCompany);
        companyForm = {
          ...company,
          departmentList: departmentDataList,
          employeePositionList: employeePositionList,
        };
        return this.apiResponse.Ok(
          response,
          200,
          'Dados da empresa enviados com sucesso.',
          companyForm,
        );
      }
    } catch (error) {
      const customError = error as CustomError;
      this.apiResponse.Error(response, customError.statusCode, customError.message);
    }
  }

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ICompanyForm>> {
    try {
      emptyToNullRecursive(request.body);
      const company = await this.companyBaseRepository.create(request.body);
      if (company) {
        const savedCompany = await this.companyBaseRepository.save(company);
        if (savedCompany) {
          const employeeList = await this.employeeBaseRepository.getDataList({
            where: { company: { idCompany: savedCompany.idCompany } },
          });
          const promiseSetEmployeeDefaultToFalse = employeeList.map(employee =>
            this.employeeBaseRepository.updateField(
              { company: { idCompany: savedCompany.idCompany } },
              { isDefault: false },
            ),
          );
          if (promiseSetEmployeeDefaultToFalse.length > 0) {
            await Promise.all(promiseSetEmployeeDefaultToFalse);
          }
          const employee = await this.employeeBaseRepository.create({
            ...request.body.employee[0],
            isDefault: true,
            company: { idCompany: savedCompany.idCompany },
          });
          await this.employeeBaseRepository.save(employee);
        }
        let companyForm: ICompanyForm | null = null;
        companyForm = await this.companyRepository.getCompanyData(savedCompany.idCompany);
        if (!companyForm.address) {
          return this.apiResponse.Error(
            response,
            500,
            'Erro ao salvar os dados de endereço. Tente novamente mais tarde.',
          );
        } else if (!companyForm.employee) {
          return this.apiResponse.Error(
            response,
            500,
            'Erro ao salvar os dados do funcionário. Tente novamente mais tarde.',
          );
        } else {
          return this.apiResponse.Ok(response, 200, 'Empresa salva com sucesso.', companyForm);
        }
      }
    } catch (error) {
      const customError = error as CustomError;
      customError.message = 'Erro ao salvar a empresa';
      this.apiResponse.Error(response, customError.statusCode, customError.message);
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IResponseCompanyForm>> {
    try {
      const data = await this.companyBaseRepository.getData({
        where: {
          [this.keyId]: Number(request.params[this.keyId]),
        },
      });
      await this.companyBaseRepository.delete(data[this.keyId]);
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
