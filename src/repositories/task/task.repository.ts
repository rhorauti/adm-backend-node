import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { Task } from '@models/task/task.model';
import { QueryRunner } from 'typeorm/browser';
import { emptyToNullRecursive } from '@utils/misc';
import { Employee } from '@models/employee/employee.model';
import { TaskType } from '@models/task/task-type.model';
import { ProductionLine } from '@models/production-line/production-line.model';
import { Product } from '@models/product/product.model';
import { CustomError } from '@middlewares/error.middleware';
import { ITask } from '@core/interfaces/task.interface';

@injectable()
export class TaskRepository {
  private taskRepository: Repository<Task>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.taskRepository = this.dataSource.getRepository(Task);
  }

  getTaskInfo = async (idTask: number): Promise<ITask> => {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let currentStep = 'initial';

    const employeeRepository = queryRunner.manager.getRepository(Employee);
    const taskTypeRepository = queryRunner.manager.getRepository(TaskType);
    const productionLineRepository = queryRunner.manager.getRepository(ProductionLine);
    const productRepository = queryRunner.manager.getRepository(Product);

    try {
      currentStep = 'get-task';
      const task = await this.taskRepository.findOne({
        where: { idTask: idTask },
      });

      currentStep = 'get-employee-list';
      const employeeList = await employeeRepository.find({
        select: { idEmployee: true, name: true },
        where: { department: { idDepartment: task.employee.department.idDepartment } },
      });

      currentStep = 'get-employee';
      const employee = await employeeRepository.findOne({
        where: { idEmployee: task.employee.idEmployee },
      });

      currentStep = 'get-task-type-list';
      const taskTypeList = await taskTypeRepository.find({
        select: { idTaskType: true, name: true },
      });

      currentStep = 'get-task-type';
      const taskType = await taskTypeRepository.findOne({
        where: { idTaskType: task.taskType.idTaskType },
      });

      currentStep = 'get-production-line-list';
      const productionLineList = await productionLineRepository.find({
        select: { idProductionLine: true, lineCode: true },
      });

      currentStep = 'get-production-line';
      const productionLine = await productionLineRepository.findOne({
        where: { idProductionLine: task.productionLine.idProductionLine },
        relations: ['toolingList'],
      });

      currentStep = 'get-product-list';
      const productList = await productRepository.find({
        select: { idProduct: true, internalPartNumber: true, name: true },
        where: { productType: { name: 'Ativo' } },
      });

      currentStep = 'get-product';
      const product = await productRepository.findOne({
        where: { idProduct: task.product.idProduct },
      });

      return {
        idTask: task.idTask,
        startDate: task.startDate,
        finishDate: task.finishDate,
        name: task.name,
        isSparePartsChanged: task.isSparePartsChanged,
        status: task.status,
        usedSpareParts: task.usedSpareParts,
        comment: task.comment,
        productList: productList,
        product: product,
        productionLineList: productionLineList,
        productionLine: productionLine,
        taskTypeList: taskTypeList,
        taskType: taskType,
        employeeList: employeeList,
        employee: employee,
      };
    } catch (error) {
      const customError = error as CustomError;
      customError.step = currentStep;
      throw customError;
    }
  };

  async saveTask(taskData: Task): Promise<Task> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let currentStep = 'initial';

    try {
      emptyToNullRecursive(taskData);
      const employeeRepository = queryRunner.manager.getRepository(Employee);
      const taskTypeRepository = queryRunner.manager.getRepository(TaskType);
      const productionLineRepository = queryRunner.manager.getRepository(ProductionLine);
      const productRepository = queryRunner.manager.getRepository(Product);

      currentStep = 'get-employee';
      const employee = await employeeRepository.findOne({
        where: { idEmployee: taskData.employee.idEmployee },
      });
      taskData.employee = employee;

      currentStep = 'get-task-type';
      const taskType = await taskTypeRepository.findOne({
        where: { idTaskType: taskData.taskType.idTaskType },
      });
      taskData.taskType = taskType;

      currentStep = 'get-production-line';
      const productionLine = await productionLineRepository.findOne({
        where: { idProductionLine: taskData.productionLine.idProductionLine },
      });
      taskData.productionLine = productionLine;

      currentStep = 'get-product';
      const product = await productRepository.findOne({
        where: { idProduct: taskData.product.idProduct },
      });
      taskData.product = product;

      currentStep = 'create-task';
      const task = this.taskRepository.create({
        ...taskData,
      });

      currentStep = 'save-task';
      const savedTask = await queryRunner.manager.save(task);

      await queryRunner.commitTransaction();

      return savedTask;
    } catch (error) {
      const customError = error as CustomError;
      customError.step = currentStep;
      await queryRunner.rollbackTransaction();
      throw customError;
    } finally {
      await queryRunner.release();
    }
  }
}
