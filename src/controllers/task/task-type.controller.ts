import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { ITaskTypeResponse } from '@core/interfaces/task.interface';
import { Department } from '@models/department/department.model';
import { TaskType } from '@models/task/task-type.model';
import { CustomErrorHandler } from '@core/error/error.core';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import {
  DEPT_NAMES_ENGLISH,
  DEPT_NAMES_LOCAL_LANGUAGE,
  translateDeptNameToLocalLanguage,
} from '@core/enum/departments.enum';

@injectable()
export class TaskTypeController {
  constructor(
    @inject(TOKENS.TaskTypeBaseRepository) private taskTypeBaseRepository: BaseRepository<TaskType>,
    @inject(TOKENS.DepartmentBaseRepository)
    private departmentBaseRepository: BaseRepository<Department>,
    @inject(TOKENS.ApiResponse)
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'Tipos de atividades';
  keyId = 'idTaskType';
  routeNameTranslatedSingular = this.routeNameTranslated.slice(0, -1);

  selectedDept: Department = null;
  paramDeptNameLocalLanguage: DEPT_NAMES_LOCAL_LANGUAGE | null = null;

  checkExistingDept = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> => {
    this.paramDeptNameLocalLanguage = translateDeptNameToLocalLanguage(
      request.params['department'] as DEPT_NAMES_ENGLISH,
    );
    const selectedDept = await this.departmentBaseRepository.getDataByField({
      name: this.paramDeptNameLocalLanguage,
    });
    if (selectedDept) {
      this.selectedDept = selectedDept;
      return;
    } else {
      throw new CustomErrorHandler(
        `Departamento ${this.paramDeptNameLocalLanguage} não encontrado.`,
        404,
      );
    }
  };

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskTypeResponse>> {
    try {
      await this.checkExistingDept(request, response, next);
      const dataList = await this.taskTypeBaseRepository.getDataListByField(
        {
          department: { idDepartment: this.selectedDept.idDepartment },
        },
        'idTaskType',
      );
      if (dataList) {
        return this.apiResponse.Ok(
          response,
          200,
          `${this.routeNameTranslated} enviados com sucesso.`,
          dataList,
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
  ): Promise<Response<ITaskTypeResponse>> {
    try {
      await this.checkExistingDept(request, response, next);
      const data = await this.taskTypeBaseRepository.getDataByField({
        idTaskType: Number(request.params[this.keyId]),
      });
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
  ): Promise<Response<ITaskTypeResponse>> {
    try {
      await this.checkExistingDept(request, response, next);
      const body = request.body as TaskType;
      if (body.department) {
        const savedData = await this.taskTypeBaseRepository.save(body);
        return this.apiResponse.Ok(
          response,
          200,
          `${this.routeNameTranslatedSingular} ${savedData.name} salvo com sucesso.`,
          savedData,
        );
      }
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
      const data = await this.taskTypeBaseRepository.getDataByField({
        idTaskType: Number(request.params[this.keyId]),
      });
      await this.taskTypeBaseRepository.delete(data[this.keyId]);
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
