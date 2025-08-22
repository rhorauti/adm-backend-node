import { Department } from '@models/department/department';
import { IDefaultResponse } from './base.interface';

export interface IDepartmentResponse extends IDefaultResponse {
  data: Department;
}
