import { Department } from '@models/department/department.model';
import { IDefaultResponse } from './base.interface';

export interface IDepartmentResponse extends IDefaultResponse {
  data: Department | Department[];
}

export type PartialDept = Pick<Department, 'idDepartment' | 'name'>;
