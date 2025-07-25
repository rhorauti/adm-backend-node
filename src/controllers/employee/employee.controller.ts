import { EmployeeRepository } from '@repositories/employee/employee.repository';
import { ICompanyParams } from '@src/core/interfaces/company.interface';
import { IEmployeeResponse } from '@src/core/interfaces/employee.interface';
import { CustomError } from '@src/middlewares/error';
import { ApiResponse } from '@src/utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class EmployeeController {
  constructor(
    @inject('EmployeeRepository') private employeeRepository: EmployeeRepository,
    @inject('ApiResponse') private apiResponse: ApiResponse,
  ) {}

  async getEmployeeList(
    request: Request<ICompanyParams>,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IEmployeeResponse>> {
    try {
      const employee = await this.employeeRepository.getEmployees(Number(request.params.idCompany));
      return this.apiResponse.Ok(
        response,
        200,
        'Dados do funcionario enviado com sucesso.',
        employee,
      );
    } catch (e: unknown) {
      const error = e as CustomError;
      error.message = 'Erro de conexão com o banco de dados ao consultar os dados do funcionário.';
      next(error);
    }
  }
}
