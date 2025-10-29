import { TOKENS } from '@containers/symbol';
import {
  DEPT_NAMES_ENGLISH,
  DEPT_NAMES_LOCAL_LANGUAGE,
  translateDeptNameToLocalLanguage,
} from '@core/enum/departments.enum';
import { CustomErrorHandler } from '@core/error/error.core';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { ITaskResponse } from '@core/interfaces/task.interface';
import { CustomError } from '@middlewares/error.middleware';
import { Department } from '@models/department/department.model';
import { Employee } from '@models/employee/employee.model';
import { Task } from '@models/task/task.model';
import { BaseRepository } from '@repositories/base/base.repository';
import { TaskRepository } from '@repositories/task/task.repository';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { CloudStorage } from 'GCP/cloud-storage.gcp';
import { inject, injectable } from 'tsyringe';

@injectable()
export class TaskFakeController {
  constructor(
    @inject(TOKENS.TaskRepository) private taskRepository: TaskRepository,
    @inject(TOKENS.TaskBaseRepository) private taskBaseRepository: BaseRepository<Task>,
    @inject(TOKENS.EmployeeBaseRepository) private employeeBaseRepository: BaseRepository<Employee>,
    @inject(TOKENS.DepartmentBaseRepository)
    private departmentBaseRepository: BaseRepository<Department>,
    @inject(TOKENS.CloudStorage)
    private cloudStorage: CloudStorage,
    @inject(TOKENS.ApiResponse)
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'Atividades';
  keyId = 'idTask';
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
    const selectedDept = await this.departmentBaseRepository.getData({
      where: {
        name: this.paramDeptNameLocalLanguage,
      },
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
  ): Promise<Response<ITaskResponse>> {
    try {
      await this.checkExistingDept(request, response, next);
      const tasks = await this.taskRepository.getTaskList(this.selectedDept.name);
      if (tasks) {
        return this.apiResponse.Ok(
          response,
          200,
          `${this.routeNameTranslated} enviados com sucesso.`,
          tasks,
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
      const taskData = await this.taskRepository.getTaskInfo(request);
      if (taskData.imgPreviewList) {
        const photoUrlPromises = taskData.imgPreviewList.map(async img => {
          const [url] = await this.cloudStorage.getReadSignedUrl(img.objectKey);
          return { idPhoto: img.idPhoto, previewUrl: url, file: null };
        });
        const signedUrlList = (await Promise.all(photoUrlPromises)).filter(Boolean);
        taskData.imgPreviewList = signedUrlList;
      }
      return this.apiResponse.Ok(
        response,
        200,
        `${this.routeNameTranslatedSingular} enviado com sucesso.`,
        taskData,
      );
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro na consulta de ${this.routeNameTranslatedSingular}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  prefixes = [
    'Blue',
    'Green',
    'Red',
    'Silver',
    'Golden',
    'Bright',
    'Quantum',
    'Neo',
    'Next',
    'Future',
    'Nova',
    'Apex',
    'Zenith',
    'Hyper',
    'Meta',
    'Omni',
    'Eco',
    'Cyber',
    'Fusion',
    'Vertex',
    'Alpha',
    'Beta',
    'Lunar',
    'Solar',
    'Urban',
    'Velocity',
    'Cloud',
    'Net',
    'Digital',
    'Smart',
    'Infinity',
    'Dynamic',
    'Synergy',
  ];

  suffixes = [
    'Solutions',
    'Systems',
    'Technologies',
    'Enterprises',
    'Group',
    'Corp',
    'LLC',
    'Inc',
    'Studios',
    'Labs',
    'Works',
    'Networks',
    'Industries',
    'Holdings',
    'Partners',
    'Consulting',
    'Software',
    'Media',
    'Logistics',
    'Innovations',
    'Ventures',
    'Designs',
    'Development',
    'Analytics',
    'Services',
    'Dynamics',
  ];

  setRandomName(): string {
    const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
    const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
    const id = Math.floor(Math.random());
    return `${prefix} ${suffix} ${id}`;
  }

  status = [1, 2, 3];

  setRandomStatus(): number {
    return this.status[Math.floor(Math.random() * this.status.length)];
  }

  setRandomDate(): Date {
    const year = 2025;
    const start = Date.UTC(year, 0, 1, 0, 0, 0, 0); // 2025-01-01T00:00:00.000Z
    const end = Date.UTC(year, 11, 31, 23, 59, 59, 999); // 2025-12-31T23:59:59.999Z
    const randTs = Math.floor(Math.random() * (end - start + 1)) + start;
    return new Date(randTs);
  }

  randomTask: Task = {
    idTask: null,
    name: '',
    status: 0,
    usedSpareParts: null,
    comment: '',
    startDate: new Date(),
    finishDate: null,
    employee: null,
  };

  bucketFolder = 'task-img';
  idEmployee = 1;

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskResponse>> {
    try {
      const registersNumber = 20;
      this.checkExistingDept(request, response, next);
      const emplooyee = await this.employeeBaseRepository.getData({
        where: {
          idEmployee: this.idEmployee,
        },
      });
      const baseTimestamp = Date.now();
      for (let i = 0; i < registersNumber; i++) {
        this.randomTask.idTask = null;
        const uniqueId = `${baseTimestamp}${i}`;
        this.randomTask.name = this.setRandomName() + uniqueId;
        this.randomTask.status = this.setRandomStatus();
        this.randomTask.startDate = this.setRandomDate();
        this.randomTask.employee = emplooyee;
        await this.taskBaseRepository.save(this.randomTask);
      }
      return response.json({
        message: `${registersNumber} registros de teste inseridos com sucesso!`,
      });
    } catch (error) {
      const customError = error as CustomError;
      if ((error && error.code == 'ER_DUP_ENTRY') || error?.code === '23505') {
        customError.statusCode = 409;
        customError.message = 'Registro duplicado.';
        this.apiResponse.Error(response, customError.statusCode, customError.message);
      } else if (customError.step && customError.step.length > 0) {
        customError.message = `Erro no step: ${customError.step}`;
      } else {
        customError.message = `Erro ao salvar o registro: ${error.message}.`;
      }
      this.apiResponse.Error(response, 500, `current step: ${customError.message}`);
    }
  }

  async delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDefaultResponse>> {
    try {
      const tasks = await this.taskBaseRepository.getDataList({ order: { idTask: 'DESC' } });
      tasks.forEach(async task => {
        await this.taskBaseRepository.delete(task.idTask);
      });
      return response.json({
        message: `Todas as ${tasks.length} atividades excluidas com sucesso.`,
      });
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro ao excluir ${this.routeNameTranslatedSingular}: ${error.message} `;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }
}
