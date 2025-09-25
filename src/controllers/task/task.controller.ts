import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { translateDeptName } from '@utils/misc';
import { Department } from '@models/department/department.model';
import { CustomErrorHandler } from '@core/error/error.core';
import { ITaskResponse } from '@core/interfaces/task.interface';
import { Task } from '@models/task/task.model';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import { TaskRepository } from '@repositories/task/task.repository';

@injectable()
export class TaskController {
  constructor(
    @inject(TOKENS.TaskRepository) private taskRepository: TaskRepository,
    @inject(TOKENS.TaskBaseRepository) private taskBaseRepository: BaseRepository<Task>,
    @inject(TOKENS.DepartmentBaseRepository)
    private departmentBaseRepository: BaseRepository<Department>,
    // @inject(TOKENS.ProductionLineBaseRepository)
    // @inject(TOKENS.TaskTypeBaseRepository)
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
    const selectedDept = await this.departmentBaseRepository.getDataByField({
      name: this.paramDeptName,
    });
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
      const task = await this.taskBaseRepository.getDataList('idTask');
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
      const data = await this.taskRepository.getTaskInfo(request.body[this.keyId]);
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
      const savedData = await this.taskRepository.saveTask(request.body);
      if (savedData) {
        return this.apiResponse.Ok(
          response,
          200,
          `${this.routeNameTranslatedSingular} ${savedData.name} salvo(a) com sucesso.`,
          savedData,
        );
      }
    } catch (error) {
      const customError = error as CustomError;
      if ((error && error.code == 'ER_DUP_ENTRY') || error?.code === '23505') {
        customError.statusCode = 409;
        customError.message = 'Registro duplicado.';
        this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else if (customError.step.length > 0) {
        customError.message = `Erro no step: ${customError.step}`;
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
      const data = await this.taskBaseRepository.getDataByField({
        idTask: Number(request.params[this.keyId]),
      });
      await this.taskBaseRepository.delete(data[this.keyId]);
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
