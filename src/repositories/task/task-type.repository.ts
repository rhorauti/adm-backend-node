import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { TaskType } from '@models/task/task-type.model';

@injectable()
export class TaskTypeRepository {
  private taskTypeRepository: Repository<TaskType>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.taskTypeRepository = this.dataSource.getRepository(TaskType);
  }

  async getDataList(deptName: string): Promise<TaskType[]> {
    return this.taskTypeRepository.find({
      where: { name: deptName },
      order: { idTaskType: 'DESC' },
    });
  }

  async getData(id: number, deptName: string): Promise<TaskType> {
    return await this.taskTypeRepository.findOne({
      where: {
        idTaskType: id,
        name: deptName,
      },
    });
  }

  async getDataThroughRelation(id: number, deptName: string): Promise<TaskType> {
    return await this.taskTypeRepository.findOne({
      where: {
        department: { idDepartment: id },
        name: deptName,
      },
    });
  }

  async getDataListThroughRelation(id: number, deptName: string): Promise<TaskType[]> {
    return await this.taskTypeRepository.find({
      where: {
        department: { idDepartment: id },
        name: deptName,
      },
    });
  }

  async save(data: TaskType): Promise<TaskType> {
    return this.taskTypeRepository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.taskTypeRepository.delete(id);
  }
}
