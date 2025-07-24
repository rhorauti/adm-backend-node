import { EmployeeRepository } from '@repositories/employee/employee.repository';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class EmployeeController {
  constructor(@inject('EmployeeRepository') private employeeRepository: EmployeeRepository) {}

  async getEmployeeList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    try {
      const { page, limit, input, select, idCompany } = request.query;
      const companies = await this.employeeRepository.getEmployees(
        Number(page),
        Number(limit),
        input.toString(),
        select.toString(),
        Number(idCompany),
      );
      return response.status(200).json({
        date: new Date(),
        status: true,
        msg: 'Lista recebida com sucesso!',
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  }

  async saveEmployee(request: Request, response: Response, next: NextFunction): Promise<Response> {
    try {
      const message = await this.checkExistingNameOrCpf(request, next);
      if (message && message.length > 0) {
        return response.status(400).json({
          status: false,
          msg: message,
        });
      } else {
        await this.employeeRepository.save(request.body);
        return response.status(200).json({
          status: true,
          msg: 'Empresa salva com sucesso!',
        });
      }
    } catch (e) {
      console.log(e.error.msg);
      next(e);
    }
  }

  async checkExistingNameOrCpf(request: Request, next: NextFunction): Promise<string> {
    try {
      const { name, cpf } = request.body;
      const employeeName = await this.employeeRepository.findByField('name', request.body.name);
      const employeeCpf = await this.employeeRepository.findByField('cpf', request.body.cpf);
      let msg = '';
      if (
        employeeName &&
        employeeName.name.length > 0 &&
        employeeName.idEmployee != request.body.idEmployee &&
        employeeName.name.trim().toLowerCase() == name.trim().toLowerCase()
      ) {
        msg = `Esse nome ${name} já existe!`;
      } else if (
        employeeCpf &&
        employeeCpf.cpf.length > 0 &&
        employeeCpf.cpf.trim() == cpf.trim() &&
        employeeCpf.idEmployee != request.body.idEmployee
      ) {
        msg = `Esse cpf ${cpf} já existe!`;
      }
      return msg;
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> {
    const employees = request.body;
    try {
      employees.forEach(async employeeData => {
        await this.employeeRepository.delete(employeeData.idEmployee);
      });
      return response.status(200).json({
        status: true,
        msg: `${employees.length == 1 ? employees[0].name : 'Funcionários'} excluido(s) com sucesso!`,
      });
    } catch (error) {
      next(error);
    }
  }
}
