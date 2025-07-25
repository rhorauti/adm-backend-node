import { IDefaultResponse } from './base.interface';

export interface IEmployee {
  isDefault: boolean;
  idEmployee: number;
  name: string;
  cpf?: string;
  department?: string;
  position?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
}

export interface IEmployeeResponse extends IDefaultResponse {
  data: IEmployee;
}
