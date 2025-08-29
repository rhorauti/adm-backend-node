import { Department } from '@models/department/department.model';
import { IDefaultResponse } from './base.interface';

export interface IDepartmentResponse extends IDefaultResponse {
  data: Department;
}

export interface IDepartmentListResponse extends IDefaultResponse {
  data: Department[];
}
