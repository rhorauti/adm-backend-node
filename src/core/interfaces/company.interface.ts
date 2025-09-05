import { Company } from '@models/company/company.model';
import { IDefaultResponse } from './base.interface';
import { Address } from '@models/address/address.model';
import { Employee } from '@models/employee/employee.model';

export interface ICompanyDetail {
  company: Company;
  address: Address;
  employee: Employee;
}

export interface ICompanyResponse extends IDefaultResponse {
  data?: {
    company?: Company;
    address?: Address;
    employee?: Employee;
  };
}
