import { DataSource } from 'typeorm';
import { Users } from '@models/auth/users';
import { Company } from '@models/company/company';
import { Employee } from '@models/employee/employee';
import { EmployeeContract } from '@models/employee/employee-contract';
import { EmployeeVacation } from '@models/employee/employee-vacation';
import { Invoice } from '@models/invoice/invoice';
import { Product } from '@models/product/product';
import { Production } from '@models/production/production';
import { Project } from '@models/project/project';
import { ProjectEvent } from '@models/project/projectEvent';
import { PurchasingOrder } from '@models/purchasing-order/purchasingOrder';
import { Address } from '@models/address/address';
import { Asset } from '@models/asset/asset';
import { EmployeePosition } from '@models/employee/employee-position';
import { Department } from '@models/department/department';
import { Kpi } from '@models/kpi/kpi';
import { ProductionLine } from '@models/production-line/production-line';
import { MaintenanceTask } from '@models/maintenance/task';

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
    Users,
    Address,
    Asset,
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
    MaintenanceTask,
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
    Users,
    Address,
    Asset,
    Employee,
    EmployeeContract,
    EmployeeVacation,
    EmployeePosition,
    Department,
    Kpi,
    Invoice,
    Product,
    Production,
    Project,
    ProjectEvent,
    PurchasingOrder,
    ProductionLine,
  ],
});
