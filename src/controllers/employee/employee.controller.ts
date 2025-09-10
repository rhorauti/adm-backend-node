import { EmployeeRepository } from '@repositories/employee/employee.repository';
import { IEmployeeResponse } from '@core/interfaces/employee.interface';
import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { Employee } from '@models/employee/employee.model';
import { CloudStorage } from 'GCP/cloud-storage.gcp';
import { CompanyRepository } from '@repositories/company/company.respository';

@injectable()
export class EmployeeController {
  constructor(
    @inject('EmployeeRepository') private employeeRepository: EmployeeRepository,
    @inject('CompanyRepository') private companyRepository: CompanyRepository,
    @inject('ApiResponse')
    private apiResponse: ApiResponse,
    @inject('CloudStorage') private cloudStorage: CloudStorage,
  ) {}

  routeNameTranslated = 'Funcionários';
  uniqueConstraint = 'UQ_employee_cpf';
  keyId = 'idEmployee';
  relatedKeyId = 'idCompany';
  routeNameTranslatedSingular = 'do' + this.routeNameTranslated.slice(0, -1);

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeeResponse>> {
    try {
      const dataList = await this.employeeRepository.getCompleteDataList();
      return this.apiResponse.Ok(
        response,
        200,
        `Dados de ${this.routeNameTranslated} enviados com sucesso.`,
        dataList,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro ao consultar a lista de ${this.routeNameTranslated}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async getData(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeeResponse>> {
    try {
      const data = await this.employeeRepository.getDataByField(
        this.keyId as keyof Employee,
        Number(request.params[this.relatedKeyId]),
      );
      return this.apiResponse.Ok(
        response,
        200,
        `Dados ${this.routeNameTranslatedSingular} enviado com sucesso.`,
        data,
      );
    } catch (error: unknown) {
      const customError = error as CustomError;
      customError.message = `Erro ao consultar ${this.routeNameTranslatedSingular}.`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  bucketFolder = 'profile-img/';

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeeResponse>> {
    try {
      const idCompany = Number(request.params.idCompany) ?? 0;
      if (idCompany == 0) {
        this.apiResponse.Error(response, 400, 'Erro ao receber o idCompany');
      } else {
        const company = await this.companyRepository.findCompanyByField({ idCompany: idCompany });
        request.body.company = company;
        if (company) {
          const savedData = await this.employeeRepository.save(request.body);
          if (savedData) {
            const fileUrl = await this.cloudStorage.saveFile(
              request,
              response,
              'profile-img/1.jpeg',
            );
            const responseData = {
              idEmployee: savedData.idEmployee,
              isDefault: savedData.isDefault,
              name: savedData.name,
              email: savedData.email,
              deskphone: savedData.deskphone,
              cellphone: savedData.cellphone,
              photoUrl: fileUrl ?? '',
              department: savedData.department,
              employeePosition: savedData.employeePosition,
            } as Employee;
            if (savedData && fileUrl) {
              return this.apiResponse.Ok(
                response,
                200,
                `${this.routeNameTranslatedSingular} ${savedData.name} salvo com sucesso.`,
                responseData,
              );
            }
          }
        }
      }
    } catch (error) {
      const customError = error as CustomError;
      if ((error && error.code == 'ER_DUP_ENTRY') || error?.code === '23505') {
        customError.statusCode = 409;
        if (error.message.includes(this.uniqueConstraint)) {
          const uniqueConstraintArray = this.uniqueConstraint.split('_');
          customError.message = `O ${uniqueConstraintArray[uniqueConstraintArray.length - 1]} já existe e não pode estar duplicado.`;
        } else {
          customError.message = 'Registro duplicado.';
        }
        this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else {
        customError.message = `Erro ao salvar o ${this.routeNameTranslated}: ${error.message}`;
        this.apiResponse.Error(response, 500, customError.message);
      }
      console.log('erro', error);
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDefaultResponse>> {
    try {
      const data = await this.employeeRepository.getDataByField(
        this.keyId as keyof Employee,
        Number(request.params[this.keyId]),
      );
      await this.employeeRepository.delete(data[this.keyId]);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${data.name} excluido com sucesso!`,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro ao excluir o ${this.routeNameTranslated.slice(0, -1)}: ${error.message} `;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
