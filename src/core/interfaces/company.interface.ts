import { IAddress } from './address.interface';
import { IDefaultResponse } from './base.interface';
import { IEmployee } from './employee.interface';

export interface ICompany {
  idCompany: number;
  nickname: string;
  name: string;
  cnpj?: string;
  ie?: string;
  im?: string;
}

export interface ICompanyDetail {
  company: ICompany;
  address: IAddress;
  employee: IEmployee;
}

export interface ICompanyResponse extends IDefaultResponse {
  data?: {
    company?: ICompany;
    address?: IAddress;
    employee?: IEmployee;
  };
}

export interface ICompanyParams {
  idCompany: string;
}
