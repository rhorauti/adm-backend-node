import { AuthController } from '@controllers/auth/auth.controller';
import { AddressController } from '@controllers/address/address.controller';
import { CompanyController } from '@controllers/company/company.controller';
import { AddressRepository } from '@repositories/address/address.repository';
import { AuthRepository } from '@repositories/auth/auth.repository';
import { CompanyRepository } from '@repositories/company/company.respository';
import { EmailSender } from '@services/email.service';
import { container } from 'tsyringe';
import { ApiResponse } from '@utils/api-response';
import { JwtHandler } from '@services/jwt.service';
import { TaskTypeRepository } from '@repositories/task/task-type.repository';
import { TaskTypeController } from '@controllers/task/task-type.controller';
import { CompanyFakeController } from '@controllers/company/company-fake.controller';
import { EmployeePositionController } from '@controllers/employee/employee-position.controller';
import { DepartmentRepository } from '@repositories/department/department.repository';
import { DepartmentController } from '@controllers/department/department.controller';
import { ProductionLineController } from '@controllers/production-line/production-line.controller';
import { ProductionLineRepository } from '@repositories/production-line/production-line.repository';
import { EmployeeRepository } from '@repositories/employee/employee.repository';
import { EmployeeController } from '@controllers/employee/employee.controller';
import { CloudStorage } from 'GCP/cloud-storage.gcp';
import { TaskRepository } from '@repositories/task/task.repository';
import { TaskController } from '@controllers/task/task.controller';
import { ProductTypeController } from '@controllers/product/product-types.controller';
import { ProductTypeRepository } from '@repositories/product/product-type.repository';
import { ProductRepository } from '@repositories/product/product.repository';
import { ProductController } from '@controllers/product/product.controller';
import { UnitController } from '@controllers/unit/unit.controller';
import { UnitRepository } from '@repositories/unit/unit.repository';
import { BaseRepository } from '@repositories/base/base.repository';
import { DataSource } from 'typeorm/browser';
import { TOKENS } from './symbol';
import { EmployeePosition } from '@models/employee/employee-position.model';
import { Unit } from '@models/unit/unit.model';
import { Address } from '@models/address/address.model';
import { Employee } from '@models/employee/employee.model';
import { Task } from '@models/task/task.model';
import { TaskType } from '@models/task/task-type.model';
import { Department } from '@models/department/department.model';
import { ProductionLine } from '@models/production-line/production-line.model';
import { ProductType } from '@models/product/product-type.model';
import { Product } from '@models/product/product.model';
import { User } from '@models/auth/user.model.';
import { Company } from '@models/company/company.model';
import { TaskFakeController } from '@controllers/task/task-fale.controllert';

container.registerSingleton(TOKENS.ApiResponse, ApiResponse);
container.registerSingleton(TOKENS.JwtHandler, JwtHandler);
container.registerSingleton(TOKENS.EmailSender, EmailSender);
container.registerSingleton(TOKENS.CloudStorage, CloudStorage);

container.register(TOKENS.AuthBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<User>(ds, User);
  },
});

container.register(TOKENS.UnitBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<Unit>(ds, Unit);
  },
});

container.register(TOKENS.AddressBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<Address>(ds, Address);
  },
});

container.register(TOKENS.EmployeeBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<Employee>(ds, Employee);
  },
});

container.register(TOKENS.EmployeePositionBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<EmployeePosition>(ds, EmployeePosition);
  },
});

container.register(TOKENS.TaskBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<Task>(ds, Task);
  },
});

container.register(TOKENS.TaskTypeBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<TaskType>(ds, TaskType);
  },
});

container.register(TOKENS.DepartmentBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<Department>(ds, Department);
  },
});

container.register(TOKENS.ProductionLineBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<ProductionLine>(ds, ProductionLine);
  },
});

container.register(TOKENS.ProductTypeBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<ProductType>(ds, ProductType);
  },
});

container.register(TOKENS.ProductBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<Product>(ds, Product);
  },
});

container.register(TOKENS.CompanyBaseRepository, {
  useFactory: c => {
    const ds = c.resolve<DataSource>('DataSource');
    return new BaseRepository<Company>(ds, Company);
  },
});

container.registerSingleton(TOKENS.AuthRepository, AuthRepository);
container.registerSingleton(TOKENS.AuthController, AuthController);
container.registerSingleton(TOKENS.CompanyRepository, CompanyRepository);
container.registerSingleton(TOKENS.CompanyController, CompanyController);
container.registerSingleton(TOKENS.CompanyFakeController, CompanyFakeController);
container.registerSingleton(TOKENS.AddressController, AddressController);
container.registerSingleton(TOKENS.EmployeeController, EmployeeController);
container.registerSingleton(TOKENS.EmployeeRepository, EmployeeRepository);
container.registerSingleton(TOKENS.EmployeePositionController, EmployeePositionController);
container.registerSingleton(TOKENS.TaskRepository, TaskRepository);
container.registerSingleton(TOKENS.TaskController, TaskController);
container.registerSingleton(TOKENS.TaskFakeController, TaskFakeController);
container.registerSingleton(TOKENS.TaskTypeController, TaskTypeController);
container.registerSingleton(TOKENS.DepartmentController, DepartmentController);
container.registerSingleton(TOKENS.ProductionLineController, ProductionLineController);
container.registerSingleton(TOKENS.ProductTypeController, ProductTypeController);
container.registerSingleton(TOKENS.ProductController, ProductController);
container.registerSingleton(TOKENS.ProductRepository, ProductRepository);
container.registerSingleton(TOKENS.UnitController, UnitController);
