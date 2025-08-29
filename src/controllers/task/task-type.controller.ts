import { CustomError } from '@middlewares/error';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { TaskTypeRepository } from '@repositories/task/task-type.repository';
import { ITaskTypeListResponse, ITaskTypeResponse } from '@core/interfaces/task.interface';
import { DepartmentRepository } from '@repositories/department/department.repository';

@injectable()
export class TaskTypeController {
  constructor(
    @inject('TaskTypeRepository') private taskTypeRepository: TaskTypeRepository,
    @inject('DepartmentRepository') private departmentRepository: DepartmentRepository,
    @inject('ApiResponse')
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'Tipos de atividades';
  relatedName = 'department';
  keyId = 'idTaskType';
  routeNameTranslatedSingular = this.routeNameTranslated.slice(0, -1);

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskTypeListResponse>> {
    try {
      const deptName = request.params[this.relatedName];
      const selectedDept = await this.departmentRepository.getDataByField('name', deptName);
      const dataList = await this.taskTypeRepository.getDataList(selectedDept.name);
      return this.apiResponse.Ok(
        response,
        200,
        `Dados de ${this.routeNameTranslated} enviados com sucesso.`,
        dataList,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro de conexão com o banco de dados ao consultar a lista de ${this.routeNameTranslated}:  ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async getData(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskTypeResponse>> {
    try {
      const deptName = request.params[this.relatedName];
      const selectedDept = await this.departmentRepository.getDataByField('name', deptName);
      const data = await this.taskTypeRepository.getDataThroughRelation(
        request.body[this.keyId],
        selectedDept.name,
      );
      return this.apiResponse.Ok(
        response,
        200,
        `Dados do ${this.routeNameTranslatedSingular} enviado com sucesso.`,
        data,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro de conexão com o banco de dados ao consultar os dados do ${this.routeNameTranslatedSingular}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskTypeResponse>> {
    try {
      const savedData = await this.taskTypeRepository.save(request.body);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${savedData.name} salvo com sucesso.`,
        savedData,
      );
    } catch (error) {
      const customError = error as CustomError;
      if ((error && error.code == 'ER_DUP_ENTRY') || error?.code === '23505') {
        customError.statusCode = 409;
        customError.message = 'Registro duplicado.';
        this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else {
        customError.message = `Erro de conexão com o banco de dados ao consultar a tabela de ${this.routeNameTranslated}.`;
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
      const deptName = request.params[this.relatedName];
      const selectedDept = await this.departmentRepository.getDataByField('name', deptName);
      const data = await this.taskTypeRepository.getData(
        Number(request.params[this.keyId]),
        selectedDept.name,
      );
      await this.taskTypeRepository.delete(data[this.keyId]);
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} ${data.name} excluido com sucesso!`,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro de conexão com o banco de dados excluir o ${this.routeNameTranslatedSingular}: ${error.message} `;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
