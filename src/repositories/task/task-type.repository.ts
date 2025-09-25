import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { TaskType } from '@models/task/task-type.model';

@injectable()
export class TaskTypeRepository {
  private taskTypeRepository: Repository<TaskType>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.taskTypeRepository = this.dataSource.getRepository(TaskType);
  }

  // async getDataList(idDepartment: number): Promise<TaskType[]> {
  //   return this.taskTypeRepository.find({
  //     where: { department: { idDepartment: idDepartment } },
  //     order: { idTaskType: 'DESC' },
  //   });
  // }

  // async getData(idTask: number): Promise<TaskType> {
  //   return await this.taskTypeRepository.findOne({
  //     where: {
  //       idTaskType: idTask,
  //     },
  //   });
  // }

  // async save(data: TaskType): Promise<TaskType> {
  //   return this.taskTypeRepository.save(data);
  // }

  // async delete(id: number): Promise<void> {
  //   await this.taskTypeRepository.delete(id);
  // }
}
