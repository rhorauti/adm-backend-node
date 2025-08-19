import { IDepartmentResponse } from '@core/interfaces/department.interface';
import { CustomError } from '@middlewares/error';
import { DepartmentRepository } from '@repositories/department/department.repository';
import { ApiResponse } from '@utils/api-response';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DepartmentController {
  constructor(
    @inject('EmployeeRepository') private departmentRepository: DepartmentRepository,
    @inject('ApiResponse') private apiResponse: ApiResponse,
  ) {}

  async getDepartmentList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDepartmentResponse>> {
    try {
      const departments = await this.departmentRepository.getDepartmentList();
      return this.apiResponse.Ok(
        response,
        200,
        'Dados dos departamentos enviados com sucesso.',
        departments,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message =
        'Erro de conexão com o banco de dados ao consultar os dados dos deparmentos. ' +
        error.message;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async getDepartment(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDepartmentResponse>> {
    try {
      const department = await this.departmentRepository.getDepartment(request.body.idEmployee);
      return this.apiResponse.Ok(
        response,
        200,
        'Dados do departamento enviado com sucesso.',
        department,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message =
        'Erro de conexão com o banco de dados ao consultar os dados do deparmento. ' +
        error.message;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async saveDepartment(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const department = await this.departmentRepository.saveDepartment(request.body);
      return this.apiResponse.Ok(response, 200, 'Departamento salvo com sucesso.', department);
    } catch (error) {
      const customError = error as CustomError;
      if (error && error.code == 'ER_DUP_ENTRY') {
        customError.statusCode = 409;
        if (error.message.includes('UQ_department_name')) {
          customError.message = 'O departamento já existe e não pode estar duplicado.';
        } else {
          customError.message = 'registro duplicado.';
        }
      } else {
        customError.message =
          'Erro de conexão com o banco de dados ao consultar a tabela de departamentos. ' +
          error.message;
        this.apiResponse.Error(response, 500, customError.message);
      }
    }
  }

  async deleteDepartment(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const department = await this.departmentRepository.getDepartment(
        Number(request.params.idDepartment),
      );
      await this.departmentRepository.deleteDepartment(department.idDepartment);
      return this.apiResponse.Ok(
        response,
        200,
        `Departamento ${department.name} excluido com sucesso!`,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message =
        'Erro de conexão com o banco de dados excluir o deparmento. ' + error.message;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
