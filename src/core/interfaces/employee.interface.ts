import { EmployeePosition } from '@models/employee/employee-position.model';
import { IDefaultResponse } from './base.interface';
import { Employee } from '@models/employee/employee.model';
import { Department } from '@models/department/department.model';
import { PartialCompany } from './company.interface';
import { PartialDept } from './department.interface';

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

export interface IEmployeeHome {
  idEmployee: number | null;
  isDefault: boolean;
  name: string;
  cpf?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  photoUrl?: string;
  company?: string;
  department?: string | null;
  position?: string | null;
}

export type PartialEmployee = Pick<IEmployeeHome, 'idEmployee' | 'name'>;
export type PartialEmployeePosition = Pick<EmployeePosition, 'idEmployeePosition' | 'name'>;

export interface IEmployeeForm {
  idEmployee: number | null;
  isDefault: boolean;
  name: string;
  cpf?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  photoUrl?: string;
  company?: PartialCompany;
  departmentList?: PartialDept[];
  department?: PartialDept;
  employeePositionList?: PartialEmployeePosition[];
  employeePosition?: PartialEmployeePosition;
}

export interface IEmployeeCompleteDataResponse extends IDefaultResponse {
  data?: IEmployeeDTO | IEmployeeDTO[];
}

export interface IEmployeeFormResponse extends IDefaultResponse {
  data?: IEmployeeForm | IEmployeeForm[];
}

export interface IEmployeeResponse extends IDefaultResponse {
  data?: Employee | Employee[];
}

export interface IEmployeePositionResponse extends IDefaultResponse {
  data?: EmployeePosition | EmployeePosition[];
}
