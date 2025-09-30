import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { Task } from '@models/task/task.model';
import { QueryRunner } from 'typeorm/browser';
import { emptyToNullRecursive, translateDeptName } from '@utils/misc';
import { Employee } from '@models/employee/employee.model';
import { TaskType } from '@models/task/task-type.model';
import { ProductionLine } from '@models/production-line/production-line.model';
import { Product } from '@models/product/product.model';
import { CustomError } from '@middlewares/error.middleware';
import { ITask } from '@core/interfaces/task.interface';
import { Request } from 'express';
import { TASK_NUMBER_STATUS } from '@core/enum/status.enum';
import { BaseRepository } from '@repositories/base/base.repository';
import { TOKENS } from '@containers/symbol';

@injectable()
export class TaskRepository {
  private taskRepository: Repository<Task>;

  constructor(
    @inject('DataSource') private dataSource: DataSource,
    @inject(TOKENS.TaskBaseRepository) private taskBaseRepository: BaseRepository<Task>,
  ) {
    this.taskRepository = this.dataSource.getRepository(Task);
  }

  getTaskInfo = async (request: Request): Promise<ITask> => {
    const idTask = Number(request.params['idTask']);
    const deptName = translateDeptName(request.params['department']);
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let currentStep = 'initial';
    let task: Task | null = null;
    let employee: Employee | null = null;
    let taskType: TaskType | null = null;
    let productionLine: ProductionLine | null = null;
    let product: Product | null = null;

    const employeeRepository = queryRunner.manager.getRepository(Employee);
    const taskTypeRepository = queryRunner.manager.getRepository(TaskType);
    const productionLineRepository = queryRunner.manager.getRepository(ProductionLine);
    const productRepository = queryRunner.manager.getRepository(Product);

    try {
      currentStep = 'get-employee-list';
      const employeeList = await employeeRepository.find({
        select: { idEmployee: true, name: true },
        where: { department: { name: deptName } },
      });

      currentStep = 'get-task-type-list';
      const taskTypeList = await taskTypeRepository.find({
        select: { idTaskType: true, name: true },
      });

      currentStep = 'get-production-line-list';
      const productionLineList = await productionLineRepository.find({
        select: { idProductionLine: true, lineCode: true, toolingList: true },
      });

      currentStep = 'get-product-list';
      const toolingList = await productRepository.find({
        select: { idProduct: true, internalPartNumber: true, name: true },
        where: { productType: { name: 'Ativo' } },
      });

      if (idTask != 0) {
        currentStep = 'get-task';
        task = await this.taskRepository.findOne({
          where: { idTask: idTask },
          relations: ['employee', 'taskType', 'productionLine', 'product'],
        });

        if (task.employee && task.employee != null) {
          currentStep = 'get-employee';
          employee = await employeeRepository.findOne({
            where: { idEmployee: task.employee.idEmployee },
          });
        }

        if (task.taskType && task.taskType != null) {
          currentStep = 'get-task-type';
          taskType = await taskTypeRepository.findOne({
            where: { idTaskType: task.taskType.idTaskType },
          });
        }

        if (task.productionLine && task.productionLine != null) {
          currentStep = 'get-production-line';
          productionLine = await productionLineRepository.findOne({
            where: { idProductionLine: task.productionLine.idProductionLine },
          });
        }

        if (task.product && task.product != null) {
          currentStep = 'get-product';
          product = await productRepository.findOne({
            where: { idProduct: task.product.idProduct },
          });
        }

        return {
          idTask: task.idTask,
          startDate: task.startDate != null ? task.startDate.toISOString() : null,
          finishDate: task.finishDate != null ? task.finishDate.toISOString() : null,
          name: task.name,
          status: task.status,
          usedSpareParts: task.usedSpareParts,
          comment: task.comment,
          toolingList: toolingList,
          product: product,
          productionLineList: productionLineList,
          productionLine: productionLine,
          taskTypeList: taskTypeList,
          taskType: taskType,
          employeeList: employeeList,
          employee: employee,
        };
      }

      return {
        idTask: null,
        startDate: null,
        finishDate: null,
        name: '',
        status: 0,
        usedSpareParts: [],
        comment: '',
        toolingList: toolingList,
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

      if (taskData.taskType && taskData.taskType != null) {
        currentStep = 'get-task-type';
        const taskType = await taskTypeRepository.findOne({
          where: { idTaskType: taskData.taskType.idTaskType },
        });
        taskData.taskType = taskType;
      }

      if (taskData.productionLine && taskData.productionLine != null) {
        currentStep = 'get-production-line';
        const productionLine = await productionLineRepository.findOne({
          where: { idProductionLine: taskData.productionLine.idProductionLine },
        });
        taskData.productionLine = productionLine;
      }

      if (taskData.product && taskData.product != null) {
        currentStep = 'get-tooling';
        const tooling = await productRepository.findOne({
          where: { idProduct: taskData.product.idProduct },
        });
        taskData.product = tooling;
      }

      if (taskData.status == null) taskData.status = 0;
      taskData.startDate = taskData.startDate ? new Date(taskData.startDate) : null;
      taskData.finishDate = taskData.finishDate ? new Date(taskData.finishDate) : null;

      currentStep = 'set-status';
      if (taskData.status == TASK_NUMBER_STATUS.NOT_STARTED && taskData.startDate == null) {
        taskData.startDate = new Date();
        taskData.status = TASK_NUMBER_STATUS.UNDER_PROGRESS;
      } else if (taskData.status == TASK_NUMBER_STATUS.UNDER_PROGRESS) {
        const tasks = await this.taskBaseRepository.getDataListByField(
          { employee: { idEmployee: taskData.employee.idEmployee } },
          'idTask',
        );
        tasks.forEach(async task => {
          if (task.status != TASK_NUMBER_STATUS.UNDER_PROGRESS) {
            await this.taskBaseRepository.updateField(
              { idTask: task.idTask },
              { status: TASK_NUMBER_STATUS.PAUSED },
            );
          }
        });
      } else if (taskData.status == TASK_NUMBER_STATUS.FINISHED) {
        taskData.finishDate = new Date();
      } else {
        taskData.status = TASK_NUMBER_STATUS.NOT_STARTED;
      }

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
