import { EmployeeRepository } from '@repositories/employee/employee.repository';
import {
  IEmployeeForm,
  IEmployeeFormResponse,
  IEmployeeResponse,
} from '@core/interfaces/employee.interface';
import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { Employee } from '@models/employee/employee.model';
import { CloudStorage } from 'GCP/cloud-storage.gcp';
import { GetSignedUrlResponse } from '@google-cloud/storage';
import { TOKENS } from '@containers/symbol';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { BaseRepository } from '@repositories/base/base.repository';
import { Department } from '@models/department/department.model';
import { Company } from '@models/company/company.model';

@injectable()
export class EmployeeController {
  constructor(
    @inject(TOKENS.EmployeeRepository) private employeeRepository: EmployeeRepository,
    @inject(TOKENS.EmployeeBaseRepository) private employeeBaseRepository: BaseRepository<Employee>,
    @inject(TOKENS.CompanyBaseRepository)
    private companyBaseRepository: BaseRepository<Company>,
    @inject(TOKENS.DepartmentBaseRepository)
    private departmentBaseRepository: BaseRepository<Department>,
    @inject(TOKENS.EmployeePositionBaseRepository)
    private employeePositionBaseRepository: BaseRepository<EmployeePosition>,
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
      const idCompany = Number(request.params.idCompany);
      const employeeList = await this.employeeRepository.getEmployeeList(idCompany);
      return this.apiResponse.Ok(
        response,
        200,
        `Dados de ${this.routeNameTranslated} enviados com sucesso.`,
        employeeList,
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
  ): Promise<Response<IEmployeeFormResponse>> {
    try {
      const idCompany = Number(request.params.idCompany) ?? 0;
      const employeeFormData: IEmployeeForm = {
        idEmployee: null,
        isDefault: false,
        name: '',
        cpf: '',
        email: '',
        deskphone: '',
        cellphone: '',
        photoUrl: '',
        company: { idCompany: null, name: '' },
        departmentList: [],
        department: { idDepartment: null, name: '' },
        employeePositionList: [],
        employeePosition: { idEmployeePosition: null, name: '' },
      };
      const employeePositionList = await this.employeePositionBaseRepository.getDataList({
        order: { idEmployeePosition: 'ASC' },
      });
      if (Array.isArray(employeePositionList)) {
        employeeFormData.employeePositionList = employeePositionList.map(pos => ({
          idEmployeePosition: pos.idEmployeePosition,
          name: pos.name,
        }));
      }

      const departmentList = await this.departmentBaseRepository.getDataList({
        order: { idDepartment: 'ASC' },
      });
      if (Array.isArray(departmentList)) {
        employeeFormData.departmentList = departmentList.map(dept => ({
          idDepartment: dept.idDepartment,
          name: dept.name,
        }));
      }
      const employee = await this.employeeBaseRepository.getData({
        where: {
          [this.keyId]: Number(request.params[this.keyId]),
        },
        relations: ['department', 'employeePosition'],
      });
      if (employee && employee != null) {
        employeeFormData.idEmployee = employee.idEmployee;
        employeeFormData.isDefault = employee.isDefault;
        employeeFormData.name = employee.name ?? '';
        employeeFormData.cpf = employee.cpf ?? '';
        employeeFormData.email = employee.email ?? '';
        employeeFormData.deskphone = employee.deskphone ?? '';
        employeeFormData.cellphone = employee.cellphone ?? '';
        if (employeeFormData.department) {
          employeeFormData.department = {
            idDepartment: employee.department.idDepartment,
            name: employee.department.name ?? '',
          };
        }
        if (employeeFormData.employeePosition) {
          employeeFormData.employeePosition = {
            idEmployeePosition: employee.employeePosition.idEmployeePosition,
            name: employee.employeePosition.name ?? '',
          };
        }
      }

      const company = await this.companyBaseRepository.getData({
        where: {
          idCompany: Number(idCompany),
        },
      });
      if (company && company != null) {
        employeeFormData.company = { idCompany: company.idCompany, name: company.name };
      }

      let signedPhotoUrl: GetSignedUrlResponse = null;
      if (employee?.photoUrl) {
        signedPhotoUrl = await this.cloudStorage.getReadSignedUrl(employee.photoUrl);
        employeeFormData.photoUrl = signedPhotoUrl[0];
      }

      return this.apiResponse.Ok(
        response,
        200,
        `Dados ${this.routeNameTranslatedSingular} enviado com sucesso.`,
        employeeFormData,
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
        const company = await this.companyBaseRepository.getData({
          where: {
            idCompany: idCompany,
          },
        });
        employeeData.company = company;
        if (company) {
          const justSavedEmployee = await this.employeeBaseRepository.save(employeeData);
          const updatedData = await this.employeeBaseRepository.getData({
            where: {
              idEmployee: justSavedEmployee.idEmployee,
            },
          });
          if (employeeData.isRemovedPhoto && updatedData.photoUrl) {
            await this.cloudStorage.deleteFile(updatedData.photoUrl);
            const department = await this.departmentBaseRepository.getData({
              where: {
                idDepartment: employeeData.department.idDepartment,
              },
            });
            const employeePosition = await this.employeePositionBaseRepository.getData({
              where: {
                idEmployeePosition: employeeData.employeePosition.idEmployeePosition,
              },
            });
            employeeData.department = department;
            employeeData.employeePosition = employeePosition;
            await this.employeeBaseRepository.updateField(
              { idEmployee: updatedData.idEmployee },
              { photoUrl: null },
            );
          }
          let signedPhotoUrl: GetSignedUrlResponse = null;
          if (request.file) {
            const key = `${this.bucketFolder}${updatedData.idEmployee}.jpeg`;
            const objectKey = await this.cloudStorage.saveFile(response, request.file, key);
            if (objectKey) {
              await this.employeeBaseRepository.updateField(
                { idEmployee: updatedData.idEmployee },
                { photoUrl: objectKey },
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
      const data = await this.employeeBaseRepository.getData({
        where: {
          [this.keyId]: Number(request.params[this.keyId]),
        },
      });
      const employee = await this.employeeBaseRepository.getData({
        where: {
          idEmployee: data[this.keyId],
        },
      });
      if (employee) await this.employeeBaseRepository.delete(data[this.keyId]);
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
