import { TaskType } from '@models/task/task-type.model';
import { IDefaultResponse } from './base.interface';
import { Task } from '@models/task/task.model';
import { Employee } from '@models/employee/employee.model';
import { ProductionLine } from '@models/production-line/production-line.model';
import { Product } from '@models/product/product.model';

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
export type PartialProduct = Pick<Product, 'idProduct' | 'internalPartNumber' | 'name'>;
export interface UsedSpareParts {
  idProduct: number;
  name: string;
  qty: number;
}

export interface ITask {
  idTask: number;
  startDate?: Date | null;
  finishDate?: Date | null;
  name?: string;
  status?: number;
  comment?: string;
  imgPreviewList?: string[];
  productList?: PartialProduct[];
  product?: PartialProduct;
  isSparePartsChanged?: boolean;
  usedSpareParts?: UsedSpareParts[];
  productionLineList?: PartialProductionLine[];
  productionLine?: PartialProductionLine;
  taskTypeList?: PartialTaskType[];
  taskType?: PartialTaskType;
  employeeList?: PartialEmployee[];
  employee?: PartialEmployee;
}
