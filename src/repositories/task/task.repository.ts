import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { Task } from '@models/task/task.model';

@injectable()
export class TaskRepository {
  private taskRepository: Repository<Task>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.taskRepository = this.dataSource.getRepository(Task);
  }

  async getDataList(): Promise<Task[]> {
    return this.taskRepository.find({
      order: { idTask: 'DESC' },
    });
  }

  async getData(idTask: number): Promise<Task> {
    return await this.taskRepository.findOne({
      where: {
        idTask: idTask,
      },
    });
  }

  async save(data: Task): Promise<Task> {
    return this.taskRepository.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
