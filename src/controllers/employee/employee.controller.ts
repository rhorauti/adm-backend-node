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
import { GetSignedUrlResponse } from '@google-cloud/storage';
import { TOKENS } from '@containers/symbol';
import { DepartmentRepository } from '@repositories/department/department.repository';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { BaseRepository } from '@repositories/base/base.repository';

@injectable()
export class EmployeeController {
  constructor(
    @inject(TOKENS.EmployeeRepository) private employeeRepository: EmployeeRepository,
    @inject(TOKENS.DepartmentRepository) private departmentRepository: DepartmentRepository,
    @inject(TOKENS.EmployeePositionBaseRepository)
    private employeePositionBaseRepository: BaseRepository<EmployeePosition>,
    @inject(TOKENS.CompanyRepository) private companyRepository: CompanyRepository,
    @inject(TOKENS.ApiResponse)
    private apiResponse: ApiResponse,
    @inject(TOKENS.CloudStorage) private cloudStorage: CloudStorage,
  ) {}

  routeNameTranslated = 'Funcionários';
  uniqueConstraint = 'UQ_employee_cpf';
  keyId = 'idEmployee';
  relatedKeyId = 'idCompany';
  routeNameTranslatedSingular = this.routeNameTranslated.slice(0, -1);

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeeResponse>> {
    try {
      const dataList = await this.employeeRepository.getCompleteDataList();
      const withSigned = await Promise.all(
        dataList.map(async (e: Employee) => {
          if (e.photoUrl) {
            const [url] = await this.cloudStorage.getReadSignedUrl(e.photoUrl);
            return { ...e, photoUrl: url };
          }
          return e;
        }),
      );
      return this.apiResponse.Ok(
        response,
        200,
        `Dados de ${this.routeNameTranslated} enviados com sucesso.`,
        withSigned,
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
        Number(request.params[this.keyId]),
      );
      let signedPhotoUrl: GetSignedUrlResponse = null;
      if (data.photoUrl) {
        signedPhotoUrl = await this.cloudStorage.getReadSignedUrl(data.photoUrl);
      }
      const responseData = {
        idEmployee: data.idEmployee,
        isDefault: data.isDefault,
        name: data.name,
        email: data.email,
        deskphone: data.deskphone,
        cellphone: data.cellphone,
        photoUrl: signedPhotoUrl[0] ?? '',
        department: data.department,
        employeePosition: data.employeePosition,
      } as Employee;
      return this.apiResponse.Ok(
        response,
        200,
        `Dados ${this.routeNameTranslatedSingular} enviado com sucesso.`,
        responseData,
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
      const employeeData = JSON.parse(request.body.data);
      if (employeeData.photoUrl) delete employeeData.photoUrl;
      const idCompany = Number(request.params.idCompany) ?? 0;
      if (idCompany == 0) {
        this.apiResponse.Error(response, 400, 'Erro ao receber o idCompany');
      } else {
        const company = await this.companyRepository.findCompanyByField({ idCompany: idCompany });
        employeeData.company = company;
        if (company) {
          const justSavedEmployee = await this.employeeRepository.save(employeeData);
          const updatedData = await this.employeeRepository.getDataByField(
            'idEmployee',
            justSavedEmployee.idEmployee,
          );
          if (employeeData.isRemovedPhoto && updatedData.photoUrl) {
            await this.cloudStorage.deleteFile(updatedData.photoUrl);
            const department = await this.departmentRepository.getDataByField(
              'idDepartment',
              employeeData.department.idDepartment,
            );
            const employeePosition = await this.employeePositionBaseRepository.getDataByField({
              idEmployeePosition: employeeData.employeePosition.idEmployeePosition,
            });
            employeeData.department = department;
            employeeData.employeePosition = employeePosition;
            await this.employeeRepository.updateField(updatedData.idEmployee, 'photoUrl', null);
          }
          let signedPhotoUrl: GetSignedUrlResponse = null;
          if (request.file) {
            const key = `${this.bucketFolder}${updatedData.idEmployee}.jpeg`;
            const objectKey = await this.cloudStorage.saveFile(request, response, key);
            if (objectKey) {
              await this.employeeRepository.updateField(
                updatedData.idEmployee,
                'photoUrl',
                objectKey,
              );
              signedPhotoUrl = await this.cloudStorage.getReadSignedUrl(objectKey);
            }
          }
          if (!signedPhotoUrl && updatedData.photoUrl) {
            signedPhotoUrl = await this.cloudStorage.getReadSignedUrl(updatedData.photoUrl);
          }
          const responseData = {
            idEmployee: updatedData.idEmployee,
            isDefault: updatedData.isDefault,
            name: updatedData.name,
            email: updatedData.email,
            deskphone: updatedData.deskphone,
            cellphone: updatedData.cellphone,
            photoUrl: signedPhotoUrl?.[0] ?? '',
            department: updatedData.department,
            employeePosition: updatedData.employeePosition,
          } as Employee;
          return this.apiResponse.Ok(
            response,
            200,
            `${this.routeNameTranslatedSingular} ${updatedData.name} salvo com sucesso.`,
            responseData,
          );
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
      const employee = await this.employeeRepository.getDataByField('idEmployee', data[this.keyId]);
      if (employee) await this.employeeRepository.delete(data[this.keyId]);
      if (employee.photoUrl) await this.cloudStorage.deleteFile(employee.photoUrl);

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
