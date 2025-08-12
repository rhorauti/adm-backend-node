import { IDefaultResponse } from './base.interface';

export interface IEmployee {
  idEmployee: number;
  isDefault: boolean;
  name: string;
  cpf?: string;
  department?: string;
  position?: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  phtoUrl?: string;
}

export interface IEmployeeResponse extends IDefaultResponse {
  data: IEmployee;
}
