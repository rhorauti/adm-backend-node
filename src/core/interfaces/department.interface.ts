import { IDefaultResponse } from './base.interface';

export interface IDepartment {
  idEmployee: number;
  name: string;
}

export interface IDepartmentResponse extends IDefaultResponse {
  data: IDepartment;
}
