import { EmployeePosition } from '@models/employee/employee-position.model';
import { IDefaultResponse } from './base.interface';
import { Employee } from '@models/employee/employee.model';
import { Department } from '@models/department/department.model';

export interface IEmployeeDTO {
  idEmployee: number;
  isDefault: boolean;
  name: string;
  cpf?: string;
  department?: Department;
  position?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  photoUrl?: string;
}

export interface IEmployeeCompleteDataResponse extends IDefaultResponse {
  data?: IEmployeeDTO | IEmployeeDTO[];
}

export interface IEmployeeResponse extends IDefaultResponse {
  data?: Employee | Employee[];
}

export interface IEmployeePositionResponse extends IDefaultResponse {
  data?: EmployeePosition | EmployeePosition[];
}
