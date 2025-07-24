import { IAddress } from './address.interface';
import { IEmployee } from './employee.interface';

export interface ICompany {
  idCompany: number;
  type: number;
  nickname: string;
  name: string;
  cnpj?: string;
  ie?: string;
  im?: string;
}

export interface ICompanyRegister {
  company: ICompany;
  address: IAddress;
  employee: IEmployee;
}

export interface IResponseCompany {
  date: string;
  status: boolean;
  msg: string;
  data?: {
    company: ICompany;
    address: IAddress;
    employee: IEmployee;
  };
}
