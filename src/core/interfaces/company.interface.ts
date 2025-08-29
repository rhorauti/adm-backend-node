import { Company } from '@models/company/company.model';
import { IDefaultResponse } from './base.interface';
import { IEmployee } from './employee.interface';
import { Address } from '@models/address/address.model';

export interface ICompanyDetail {
  company: Company;
  address: Address;
  employee: IEmployee;
}

export interface ICompanyResponse extends IDefaultResponse {
  data?: {
    company?: Company;
    address?: Address;
    employee?: IEmployee;
  };
}
