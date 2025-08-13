import { EmployeeRepository } from '@repositories/employee/employee.repository';
import { IEmployeeResponse } from '@core/interfaces/employee.interface';
import { CustomError } from '@middlewares/error';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class EmployeeController {
  constructor(
    @inject('EmployeeRepository') private employeeRepository: EmployeeRepository,
    @inject('ApiResponse') private apiResponse: ApiResponse,
  ) {}

  async getEmployee(request: Request, response: Response): Promise<Response<IEmployeeResponse>> {
    try {
      const employee = await this.employeeRepository.getEmployee(Number(request.params.idCompany));
      return this.apiResponse.Ok(
        response,
        200,
        'Dados do funcionario enviado com sucesso.',
        employee,
      );
    } catch (error: unknown) {
      const customError = error as CustomError;
      customError.message =
        'Erro de conexão com o banco de dados ao consultar os dados do funcionário.';
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async saveEmployeePosition(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const employeePosition = await this.employeeRepository.saveEmployeePosition(request.body);
      return this.apiResponse.Ok(response, 200, 'Cargo salvo com sucesso.', employeePosition);
    } catch (error) {
      const customError = error as CustomError;
      if (error && error.code == 'ER_DUP_ENTRY') {
        customError.statusCode = 409;
        if (error.message.includes('UQ_employee_position_name')) {
          customError.message = 'O cargo já existe e não pode estar duplicado.';
        } else {
          customError.message = 'registro duplicado.';
        }
      } else {
        customError.message =
          'Erro de conexão com o banco de dados ao consultar a tabela de Cargo de funcionários.';
        this.apiResponse.Error(response, 500, customError.message);
      }
    }
  }
}
