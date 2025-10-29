import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { Department } from '@models/department/department.model';
import { CustomErrorHandler } from '@core/error/error.core';
import { ITaskForm, ITaskResponse } from '@core/interfaces/task.interface';
import { Task } from '@models/task/task.model';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import { TaskRepository } from '@repositories/task/task.repository';
import { CloudStorage } from 'GCP/cloud-storage.gcp';
import { IDetailedPhoto, IPhoto } from '@core/interfaces/photo.interface';
import { ProductionLine } from '@models/production-line/production-line.model';
import { Employee } from '@models/employee/employee.model';
import { ProductRepository } from '@repositories/product/product.repository';
import { TaskType } from '@models/task/task-type.model';
import { TASK_NUMBER_STATUS } from '@core/enum/status.enum';

@injectable()
export class TaskController {
  constructor(
    @inject(TOKENS.TaskRepository) private taskRepository: TaskRepository,
    @inject(TOKENS.TaskBaseRepository) private taskBaseRepository: BaseRepository<Task>,
    @inject(TOKENS.DepartmentBaseRepository)
    private departmentBaseRepository: BaseRepository<Department>,
    @inject(TOKENS.ProductRepository)
    private productRepository: ProductRepository,
    @inject(TOKENS.EmployeeBaseRepository)
    private employeeBaseRepository: BaseRepository<Employee>,
    @inject(TOKENS.ProductionLineBaseRepository)
    private productionLineBaseRepository: BaseRepository<ProductionLine>,
    @inject(TOKENS.TaskTypeBaseRepository)
    private taskTypeBaseRepository: BaseRepository<TaskType>,
    @inject(TOKENS.CloudStorage)
    private cloudStorage: CloudStorage,
    @inject(TOKENS.ApiResponse)
    private apiResponse: ApiResponse,
  ) {}

  routeNameTranslated = 'Atividades';
  keyId = 'idTask';
  routeNameTranslatedSingular = this.routeNameTranslated.slice(0, -1);

  selectedDept: Department = null;
  idDepartment: number | null = null;

  checkExistingDept = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response> => {
    this.idDepartment = Number(request.params['idDepartment']);
    this.selectedDept = await this.departmentBaseRepository.getData({
      where: {
        idDepartment: this.idDepartment,
      },
    });
    if (!this.selectedDept) {
      throw new CustomErrorHandler(
        `Departamento com id: ${this.idDepartment} não encontrado.`,
        404,
      );
    }
    return;
  };

  async getDataList(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskResponse>> {
    try {
      await this.checkExistingDept(request, response, next);
      const tasks = await this.taskRepository.getTaskList(this.idDepartment);
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
      const idTask = Number(request.params['idTask']);
      await this.checkExistingDept(request, response, next);
      let taskForm: ITaskForm | null = null;
      const productionLineList = await this.productionLineBaseRepository.getDataList({
        select: { idProductionLine: true, lineCode: true },
        order: { idProductionLine: 'ASC' },
      });
      const employeeList = await this.employeeBaseRepository.getDataList({
        select: { idEmployee: true, name: true },
        order: { idEmployee: 'ASC' },
      });
      const taskTypeList = await this.taskTypeBaseRepository.getDataList({
        select: { idTaskType: true, name: true },
        order: { idTaskType: 'ASC' },
      });
      const productList = await this.productRepository.getProductListForTaskFormPage();
      const taskData = await this.taskRepository.getTask(idTask);
      if (!taskData || taskData == null) {
        taskForm = {
          idTask: null,
          startDate: null,
          finishDate: null,
          name: null,
          status: null,
          comment: null,
          imgPreviewList: null,
          usedSpareParts: [],
          product: null,
          productList: productList,
          productionLineList: productionLineList,
          productionLine: null,
          taskTypeList: taskTypeList,
          taskType: null,
          employeeList: employeeList,
          employee: null,
          deptName: null,
        };
      } else {
        if (taskData) {
          const imgPreviewList = await this.onGetPhotoList(taskData);
          taskForm = {
            idTask: taskData.idTask,
            startDate: taskData.startDate,
            finishDate: taskData.finishDate,
            name: taskData.name,
            status: taskData.status,
            comment: taskData.comment,
            imgPreviewList: imgPreviewList,
            usedSpareParts: taskData.usedSpareParts,
            product: taskData.product,
            productionLine: taskData.productionLine,
            taskType: taskData.taskType,
            employee: taskData.employee,
            productList: productList,
            productionLineList: productionLineList,
            taskTypeList: taskTypeList,
            employeeList: employeeList,
            deptName: this.selectedDept ? this.selectedDept.name : null,
          };
        }
        return this.apiResponse.Ok(
          response,
          200,
          `${this.routeNameTranslatedSingular} enviado com sucesso.`,
          taskForm,
        );
      }
    } catch (error) {
      const customError = error as CustomError;
      customError.message = `Erro na consulta de ${this.routeNameTranslatedSingular}: ${error.message}`;
      this.apiResponse.Error(response, 500, customError.message);
    }
  }

  bucketFolder = 'task-img';

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskResponse>> {
    let currentStep = '';
    let updatedData: Task | null = null;
    try {
      currentStep = 'check-dept';
      await this.checkExistingDept(request, response, next);
      const taskData = JSON.parse(request.body.data);
      if (taskData.imgPreviewList) delete taskData.imgPreviewList;
      const statusUpdatedData = await this.onCheckStatus(taskData);
      currentStep = 'save-task';
      const taskToBeSave = await this.taskBaseRepository.create(statusUpdatedData);
      updatedData = await this.taskBaseRepository.save(taskToBeSave);
      if (updatedData) {
        await this.onSavePhoto(request, response, updatedData);
        updatedData = await this.taskRepository.getTask(updatedData.idTask);
        return this.apiResponse.Ok(
          response,
          200,
          `${this.routeNameTranslatedSingular} ${updatedData.name} salvo(a) com sucesso.`,
          updatedData,
        );
      }
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
      this.apiResponse.Error(
        response,
        500,
        `current step: ${currentStep} : ${customError.message}`,
      );
    }
  }

  onCheckStatus = async (taskData: Task): Promise<Task> => {
    if (taskData.status == null) taskData.status = 1;
    taskData.startDate = taskData.startDate ? new Date(taskData.startDate) : null;
    taskData.finishDate = taskData.finishDate ? new Date(taskData.finishDate) : null;

    if (taskData.status == TASK_NUMBER_STATUS.NOT_STARTED && taskData.startDate == null) {
      taskData.startDate = new Date();
      taskData.status = TASK_NUMBER_STATUS.UNDER_PROGRESS;
    } else if (
      taskData.status == TASK_NUMBER_STATUS.UNDER_PROGRESS &&
      taskData.finishDate == null
    ) {
      const tasks = await this.taskBaseRepository.getDataList({
        where: { employee: { idEmployee: taskData.employee.idEmployee } },
      });
      const taskDataIdx = tasks.findIndex(task => task.idTask == taskData.idTask);
      tasks.forEach(async (task, index) => {
        if (task.status == TASK_NUMBER_STATUS.UNDER_PROGRESS && taskDataIdx != index) {
          await this.taskBaseRepository.updateField(
            { idTask: task.idTask },
            { status: TASK_NUMBER_STATUS.PAUSED },
          );
        }
      });
    } else if (
      taskData.status == TASK_NUMBER_STATUS.UNDER_PROGRESS &&
      taskData.finishDate != null
    ) {
      taskData.finishDate = null;
    } else if (taskData.status == TASK_NUMBER_STATUS.PAUSED && taskData.finishDate != null) {
      taskData.finishDate = null;
    } else if (taskData.status == TASK_NUMBER_STATUS.FINISHED && taskData.finishDate == null) {
      taskData.finishDate = new Date();
    }
    return taskData;
  };

  onGetPhotoList = async (taskData: Task): Promise<IPhoto[]> => {
    if (taskData.photoPath) {
      const photoUrlPromises = taskData.photoPath.map(async img => {
        const [url] = await this.cloudStorage.getReadSignedUrl(img.objectKey);
        return { idPhoto: img.idPhoto, previewUrl: url, file: null };
      });
      return (await Promise.all(photoUrlPromises)).filter(Boolean);
    }
  };

  onSavePhoto = async (request: Request, response: Response, taskData: Task): Promise<void> => {
    let currentPhotoPathList: IDetailedPhoto[] = [];
    const multerFiles = request.files as Express.Multer.File[];
    const bodyFiles = request.body.files;
    const clientPhotoIdList: string[] = bodyFiles
      ? typeof bodyFiles == 'string'
        ? [bodyFiles]
        : bodyFiles
      : [];
    const updatedData = await this.taskBaseRepository.getData({
      where: { idTask: taskData.idTask },
    });
    currentPhotoPathList = updatedData.photoPath ? updatedData.photoPath : [];
    if (currentPhotoPathList) {
      const deletePromises = currentPhotoPathList.map((photo, index) => {
        if (!clientPhotoIdList.some(photoId => photoId == photo.idPhoto)) {
          currentPhotoPathList.splice(index, 1);
          return this.cloudStorage.deleteFile(photo.objectKey);
        } else {
          return;
        }
      });
      if (deletePromises) await Promise.all(deletePromises);
    }
    if (multerFiles && multerFiles.length > 0) {
      const keyPromises: Promise<IDetailedPhoto>[] = multerFiles.map(async file => {
        const uniqueId = crypto.randomUUID();
        const photoId = `${String(updatedData.idTask).padStart(5, '0')}-${uniqueId}`;
        const key = `${this.bucketFolder}/${photoId}.jpeg`;
        const savedKey = await this.cloudStorage.saveFile(response, file, key);
        return {
          idPhoto: photoId,
          userId: 0,
          objectKey: savedKey,
          contentType: file.mimetype,
          size: file.size,
          createdAt: new Date(),
        };
      });
      const detailedPhotoList = (await Promise.all(keyPromises)).filter(Boolean);
      detailedPhotoList.forEach(photo => {
        currentPhotoPathList.push(photo);
      });
    }
    await this.taskBaseRepository.updateField(
      { idTask: updatedData.idTask },
      { photoPath: currentPhotoPathList },
    );
  };

  async delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<IDefaultResponse>> {
    try {
      await this.checkExistingDept(request, response, next);
      const data = await this.taskBaseRepository.getData({
        where: {
          idTask: Number(request.params[this.keyId]),
        },
      });
      if (data) await this.taskBaseRepository.delete(data[this.keyId]);
      if (data && data.photoPath != null) {
        const deletePromises = data.photoPath.map(photo =>
          this.cloudStorage.deleteFile(photo.objectKey),
        );
        if (deletePromises) Promise.all(deletePromises);
      }
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
