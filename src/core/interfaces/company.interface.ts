import { Company } from '@models/company/company.model';
import { IDefaultResponse } from './base.interface';
import { Address } from '@models/address/address.model';
import { PartialEmployeePosition } from './employee.interface';
import { PartialDept } from './department.interface';

export interface ICompanyForm {
  idCompany: number | null;
  nickname: string;
  name: string;
  cnpj?: string;
  ie?: string;
  im?: string;
  address: Address;
  employee: IEmployeeCompany[];
  employeePositionList?: PartialEmployeePosition[];
  departmentList?: PartialDept[];
}

export interface IEmployeeCompany {
  idEmployee: number | null;
  isDefault: boolean;
  name: string;
  email?: string;
  deskphone?: string;
  cellphone?: string;
  department?: PartialDept;
  employeePosition?: PartialEmployeePosition;
}

export interface IResponseCompanyForm extends IDefaultResponse {
  data?: ICompanyForm;
}

export type PartialCompany = Pick<Company, 'idCompany' | 'name'>;
