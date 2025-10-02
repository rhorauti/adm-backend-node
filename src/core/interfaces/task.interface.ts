import { TaskType } from '@models/task/task-type.model';
import { IDefaultResponse } from './base.interface';
import { Task } from '@models/task/task.model';
import { Employee } from '@models/employee/employee.model';
import { ProductionLine } from '@models/production-line/production-line.model';
import { Product } from '@models/product/product.model';
import { Timestamp } from 'typeorm';
import { IPhoto } from './photo.interface';

export interface ITaskTypeResponse extends IDefaultResponse {
  data: TaskType | TaskType[];
}

export interface ITaskResponse extends IDefaultResponse {
  data: Task | Task[];
}

export type PartialEmployee = Pick<Employee, 'idEmployee' | 'name'>;
export type PartialTaskType = Pick<TaskType, 'idTaskType' | 'name'>;
export type PartialProductionLine = Pick<
  ProductionLine,
  'idProductionLine' | 'lineCode' | 'toolingList'
>;
export type PartialProduct = Pick<
  Product,
  'idProduct' | 'internalPartNumber' | 'name' | 'productType'
>;
export interface IUsedSpareParts {
  idProduct: number;
  internalPartNumber: string;
  name: string;
  qty: number;
}

export interface ITask {
  idTask?: number;
  startDate?: string | null;
  finishDate?: string | null;
  name?: string;
  status?: number;
  comment?: string;
  imgPreviewList?: IPhoto[];
  productList?: PartialProduct[];
  product?: PartialProduct;
  usedSpareParts?: IUsedSpareParts[];
  productionLineList?: PartialProductionLine[];
  productionLine?: PartialProductionLine;
  taskTypeList?: PartialTaskType[];
  taskType?: PartialTaskType;
  employeeList?: PartialEmployee[];
  employee?: PartialEmployee;
}
