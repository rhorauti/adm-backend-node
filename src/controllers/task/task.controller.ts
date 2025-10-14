import { CustomError } from '@middlewares/error.middleware';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IDefaultResponse } from '@core/interfaces/base.interface';
import { Department } from '@models/department/department.model';
import { CustomErrorHandler } from '@core/error/error.core';
import { ITaskResponse } from '@core/interfaces/task.interface';
import { Task } from '@models/task/task.model';
import { TOKENS } from '@containers/symbol';
import { BaseRepository } from '@repositories/base/base.repository';
import { TaskRepository } from '@repositories/task/task.repository';
import { CloudStorage } from 'GCP/cloud-storage.gcp';
import { IDetailedPhoto } from '@core/interfaces/photo.interface';
import {
  DEPT_NAMES_ENGLISH,
  DEPT_NAMES_LOCAL_LANGUAGE,
  translateDeptNameToLocalLanguage,
} from '@core/enum/departments.enum';

@injectable()
export class TaskController {
  constructor(
    @inject(TOKENS.TaskRepository) private taskRepository: TaskRepository,
    @inject(TOKENS.TaskBaseRepository) private taskBaseRepository: BaseRepository<Task>,
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
  ): Promise<Response<ITaskResponse>> {
    try {
      // await this.checkExistingDept(request, response, next);
      const tasks = await this.taskRepository.getDataList(request);
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

  bucketFolder = 'task-img';

  async save(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response<ITaskResponse>> {
    let currentStep = '';
    let retrivedData: Task | null = null;
    try {
      currentStep = 'check-dept';
      await this.checkExistingDept(request, response, next);
      const taskData = JSON.parse(request.body.data);
      currentStep = 'save-task';
      if (taskData.imgPreviewList) delete taskData.imgPreviewList;
      const savedData = await this.taskRepository.saveTask(taskData);
      retrivedData = await this.taskBaseRepository.getDataByField({
        idTask: savedData.idTask,
      });
      if (retrivedData) {
        let photoListToBeSaved: IDetailedPhoto[] = [];
        const photoList = request.files as Express.Multer.File[];
        const photoIdList: string[] =
          typeof request.body.files == 'string' ? [request.body.files] : request.body.files;
        if (retrivedData.photoPath) {
          currentStep = 'delete-photo';
          photoListToBeSaved = retrivedData.photoPath;
          const deletePromises = retrivedData.photoPath.map((photo, index) => {
            if (!photoIdList.some(photoId => photoId == photo.idPhoto)) {
              photoListToBeSaved.splice(index, 1);
              return this.cloudStorage.deleteFile(photo.objectKey);
            } else {
              return;
            }
          });
          if (deletePromises) await Promise.all(deletePromises);
        }
        if (photoList && photoList.length > 0) {
          currentStep = 'save-photos';
          const keyPromises: Promise<IDetailedPhoto>[] = photoList.map(async file => {
            const uniqueId = crypto.randomUUID();
            const photoId = `${String(retrivedData.idTask).padStart(5, '0')}-${uniqueId}`;
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
            photoListToBeSaved.push(photo);
          });
        }
        await this.taskBaseRepository.updateField(
          { idTask: retrivedData.idTask },
          { photoPath: photoListToBeSaved },
        );
        return this.apiResponse.Ok(
          response,
          200,
          `${this.routeNameTranslatedSingular} ${retrivedData.name} salvo(a) com sucesso.`,
          retrivedData,
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
      if (
        currentStep == 'save-photos' &&
        retrivedData &&
        (retrivedData.idTask == null ||
          retrivedData.idTask == 0 ||
          retrivedData.idTask == undefined)
      ) {
        await this.taskBaseRepository.delete(retrivedData.idTask);
      }
      this.apiResponse.Error(
        response,
        500,
        `current step: ${currentStep} : ${customError.message}`,
      );
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
      if (data) await this.taskBaseRepository.delete(data[this.keyId]);
      const deletePromises = data.photoPath.map(photo =>
        this.cloudStorage.deleteFile(photo.objectKey),
      );
      if (deletePromises) Promise.all(deletePromises);
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
