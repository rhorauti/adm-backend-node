import { DataSource } from 'typeorm';
import { Users } from '@models/auth/users';
import { Company } from '@models/company/company';
import { Employee } from '@models/employee/employee';
import { EmployeeContract } from '@models/employee/employeeContract';
import { EmployeeVacation } from '@models/employee/employeeVacation';
import { Invoice } from '@models/invoice/invoice';
import { Product } from '@models/product/product';
import { Production } from '@models/production/production';
import { Project } from '@models/project/project';
import { ProjectEvent } from '@models/project/projectEvent';
import { PurchasingOrder } from '@models/purchasing-order/purchasingOrder';
import { Address } from '@models/address/address';
import { Asset } from '@models/asset/asset';
import { ProjectCompany } from '@models/project/project_company';
import { CreateUsersTable1703816465329 } from '@migrations/auth/1703816465329-CreateUsersTable';
import { CreateCompanyTable1718214462553 } from '@migrations/company/1718214462553-CreateCompanyTable';
import { CreateEmployeeTable1720471263659 } from '@migrations/employee/1720471263659-CreateEmployeeTable';
import { CreateAdressTable1720647166251 } from '@migrations/address/1720647166251-CreateAdressTable';
import { CreateProjectTable1720647957624 } from '@migrations/project/1720647957624-CreateProjectTable';

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
    EmployeeVacation,
    Invoice,
    Product,
    Production,
    Project,
    ProjectEvent,
    ProjectCompany,
    PurchasingOrder,
  ],
  migrations: [
    CreateUsersTable1703816465329,
    CreateCompanyTable1718214462553,
    CreateEmployeeTable1720471263659,
    CreateAdressTable1720647166251,
    CreateProjectTable1720647957624,
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
    Invoice,
    Product,
    Production,
    Project,
    ProjectEvent,
    ProjectCompany,
    PurchasingOrder,
  ],
  migrations: [
    CreateUsersTable1703816465329,
    CreateCompanyTable1718214462553,
    CreateEmployeeTable1720471263659,
    CreateAdressTable1720647166251,
    CreateProjectTable1720647957624,
  ],
});
