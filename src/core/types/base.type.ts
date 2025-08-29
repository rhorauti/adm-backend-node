// import { BaseController } from '@controllers/base/base.controller';
import { Address } from '@models/address/address.model';
import { User } from '@models/auth/user.model.';
import { Company } from '@models/company/company.model';
import { Department } from '@models/department/department.model';
import { EmployeeContract } from '@models/employee/employee-contract.model';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { EmployeeVacation } from '@models/employee/employee-vacation.model';
import { Employee } from '@models/employee/employee.model';
import { Invoice } from '@models/invoice/invoice.model';
import { Kpi } from '@models/kpi/kpi.model';
import { Product } from '@models/product/product.model';
import { ProjectEvent } from '@models/project/project-event.model';
import { Project } from '@models/project/project.model';
import { TaskType } from '@models/task/task-type.model';
import { Task } from '@models/task/task.model';

export type BaseType =
  | Company
  | Address
  | Employee
  | EmployeeContract
  | EmployeeVacation
  | EmployeePosition
  | Department
  | User
  | Kpi
  | Product
  | Project
  | ProjectEvent
  | Task
  | Invoice
  | TaskType;

type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I,
) => void
  ? I
  : never;

export type MergedDataType = UnionToIntersection<BaseType>;

type RelationalKeys<T> = T extends unknown
  ? {
      [K in keyof T]: NonNullable<T[K]> extends BaseType | BaseType[] ? K : never;
    }[keyof T]
  : never;

export type RelatedEntityProps = Extract<RelationalKeys<BaseType>, string>;

export interface DefaultResponse {
  data?: BaseType;
}

/**
 * Type to be used to choose some fields for inputSearchFilter.
 */
export type KeyOfData = Extract<keyof MergedDataType, string>;
