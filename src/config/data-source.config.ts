import { DataSource } from 'typeorm';
import { User } from '@models/auth/user.model.';
import { Company } from '@models/company/company.model';
import { Employee } from '@models/employee/employee.model';
import { EmployeeContract } from '@models/employee/employee-contract.model';
import { EmployeeVacation } from '@models/employee/employee-vacation.model';
import { Invoice } from '@models/invoice/invoice.model';
import { Product } from '@models/product/product.model';
import { Production } from '@models/production/production.model';
import { Project } from '@models/project/project.model';
import { ProjectEvent } from '@models/project/project-event.model';
import { PurchasingOrder } from '@models/purchasing-order/purchasing-order.model';
import { Address } from '@models/address/address.model';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { Department } from '@models/department/department.model';
import { Kpi } from '@models/kpi/kpi.model';
import { ProductionLine } from '@models/production-line/production-line.model';
import { Task } from '@models/task/task.model';
import { TaskType } from '@models/task/task-type.model';

export const dataSourceDev = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [
    Company,
    User,
    Address,
    Employee,
    EmployeeContract,
    EmployeePosition,
    Department,
    EmployeeVacation,
    Kpi,
    Invoice,
    Product,
    Production,
    Project,
    ProjectEvent,
    PurchasingOrder,
    ProductionLine,
    Task,
    TaskType,
  ],
});

export const dataSourceProd = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  logging: true,
  entities: [
    Company,
    User,
    Address,
    Employee,
    EmployeeContract,
    EmployeePosition,
    Department,
    EmployeeVacation,
    Kpi,
    Invoice,
    Product,
    Production,
    Project,
    ProjectEvent,
    PurchasingOrder,
    ProductionLine,
    Task,
    TaskType,
  ],
});
