import { EmployeePosition } from '@models/employee/employee-position.model';
import { IDefaultResponse } from './base.interface';
import { Employee } from '@models/employee/employee.model';

// export interface IEmployee {
//   idEmployee: number;
//   isDefault: boolean;
//   name: string;
//   cpf?: string;
//   department?: string;
//   position?: string;
//   email?: string;
//   deskphone?: string;
//   cellphone?: string;
//   photoUrl?: string;
// }

export interface IEmployeeResponse extends IDefaultResponse {
  data?: Employee | Employee[];
}

export interface IEmployeePositionResponse extends IDefaultResponse {
  data?: EmployeePosition | EmployeePosition[];
}
