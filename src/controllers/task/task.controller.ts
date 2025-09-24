import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { DepartmentRepository } from '@repositories/department/department.repository';
import { emptyStringToNull, translateDeptName } from '@utils/misc';
import { Department } from '@models/department/department.model';
import { CustomErrorHandler } from '@core/error/error.core';
import { ITaskResponse } from '@core/interfaces/task.interface';
import { Task } from '@models/task/task.model';
import { TaskRepository } from '@repositories/task/task.repository';
import { EmployeeRepository } from '@repositories/employee/employee.repository';
import { ProductRepository } from '@repositories/product/product.repository';
import { ProductionLineRepository } from '@repositories/production-line/production-line.repository';
import { TaskTypeRepository } from '@repositories/task/task-type.repository';
import { TOKENS } from '@containers/symbol';

@injectable()
export class TaskController {
  constructor(
    @inject(TOKENS.TaskRepository) private taskRepository: TaskRepository,
    @inject(TOKENS.DepartmentRepository) private departmentRepository: DepartmentRepository,
    @inject(TOKENS.EmployeeRepository) private employeeRepository: EmployeeRepository,
    @inject(TOKENS.ProductRepository) private productRepository: ProductRepository,
    @inject(TOKENS.ProductionLineRepository)
    private productionLineRepository: ProductionLineRepository,
    @inject(TOKENS.TaskTypeRepository) private taskTypeRepository: TaskTypeRepository,
    @inject(TOKENS.ApiResponse)
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'Atividades';
  keyId = 'idTask';
  routeNameTranslatedSingular = this.routeNameTranslated.slice(0, -1);

  selectedDept: Department = null;
  paramDeptName: string = null;

  checkExistingDept = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> => {
    this.paramDeptName = translateDeptName(request.params['department']);
    const selectedDept = await this.departmentRepository.getDataByField('name', this.paramDeptName);
    if (selectedDept) {
      this.selectedDept = selectedDept;
      return;
    } else {
      throw new CustomErrorHandler(
        `Departamento ${translateDeptName(this.paramDeptName)} não encontrado.`,
        404,
      );
    }
  };

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskResponse>> {
    try {
      await this.checkExistingDept(request, response, next);
      const task = await this.taskRepository.getDataList();
      const employee = await this.employeeRepository.getDataListByField({
        department: this.selectedDept,
      });
      if (task) {
        return this.apiResponse.Ok(
          response,
          200,
          `${this.routeNameTranslated} enviados com sucesso.`,
          task,
        );
      } else {
        return this.apiResponse.Ok(response, 200, 'Nenhum registro encontrado.');
      }
    } catch (error) {
      const customError = error as CustomErrorHandler;
      customError.message = `Erro na consulta de ${this.routeNameTranslatedSingular}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async getData(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskResponse>> {
    try {
      await this.checkExistingDept(request, response, next);
      const data = await this.taskRepository.getData(request.body[this.keyId]);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} enviado com sucesso.`,
        data,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro na consulta de ${this.routeNameTranslatedSingular}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskResponse>> {
    try {
      await this.checkExistingDept(request, response, next);
      const body = request.body as Task;
      emptyStringToNull(body);
      // if (body.department) {
      const savedData = await this.taskRepository.save(body);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${savedData.name} salvo com sucesso.`,
        savedData,
      );
      // }
    } catch (error) {
      const customError = error as CustomError;
      if ((error && error.code == 'ER_DUP_ENTRY') || error?.code === '23505') {
        customError.statusCode = 409;
        customError.message = 'Registro duplicado.';
        this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else {
        customError.message = `Erro ao salvar o registro: ${error.message}.`;
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
      await this.checkExistingDept(request, response, next);
      const data = await this.taskRepository.getData({
        idTask: Number(request.params[this.keyId]),
      });
      await this.taskRepository.delete(data[this.keyId]);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${data.name} excluido com sucesso!`,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro ao excluir ${this.routeNameTranslatedSingular}: ${error.message} `;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
