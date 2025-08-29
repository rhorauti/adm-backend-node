import { TaskType } from '@models/task/task-type.model';
import { IDefaultResponse } from './base.interface';
import { Task } from '@models/task/task.model';

export interface ITaskTypeResponse extends IDefaultResponse {
  data: TaskType;
}

export interface ITaskTypeListResponse extends IDefaultResponse {
  data: TaskType[];
}

export interface ITaskResponse extends IDefaultResponse {
  data: Task;
}

export interface ITaskListResponse extends IDefaultResponse {
  data: Task[];
}
