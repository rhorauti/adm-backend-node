import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { Task } from '@models/task/task.model';
import { ITaskHome } from '@core/interfaces/task.interface';

@injectable()
export class TaskRepository {
  private taskRepository: Repository<Task>;

  constructor(@inject('DataSource') private dataSource: DataSource) {
    this.taskRepository = this.dataSource.getRepository(Task);
  }

  getTaskList = async (idDepartment: number): Promise<ITaskHome[]> => {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')

      .select([
        'task.idTask AS "idTask"',
        'task.startDate AS "startDate"',
        'task.finishDate AS "finishDate"',
        'task.name AS "name"',
        'task.status AS "status"',
      ])
      .leftJoin('task.employee', 'employee')
      .leftJoin('employee.department', 'department')
      .leftJoin('task.taskType', 'taskType')
      .leftJoin('task.product', 'product')
      .leftJoin('task.productionLine', 'productionLine')

      .addSelect([
        'employee.name AS "employee"',
        'department.name AS "deptName"',
        'taskType.name AS "taskType"',
        'product.name AS "product"',
        'productionLine.lineCode AS "lineCode"',
      ])
      .where('department.idDepartment = :idDepartment', { idDepartment: idDepartment })
      .orderBy('task.idTask', 'DESC')

      .getRawMany();

    return tasks as ITaskHome[];
  };

  getTask = async (idTask: number): Promise<Task> => {
    return await this.taskRepository
      .createQueryBuilder('task')
      .select([
        'task.idTask',
        'task.name',
        'task.startDate',
        'task.finishDate',
        'task.photoPath',
        'task.status',
        'task.comment',
        'task.usedSpareParts',
      ])
      .leftJoin('task.product', 'product')
      .leftJoin('task.productionLine', 'productionLine')
      .leftJoin('task.taskType', 'taskType')
      .leftJoin('task.employee', 'employee')
      .addSelect([
        'product.idProduct',
        'product.name',
        'productionLine.idProductionLine',
        'productionLine.lineCode',
        'taskType.idTaskType',
        'taskType.name',
        'employee.idEmployee',
        'employee.name',
      ])
      .where('task.idTask = :idTask', { idTask: idTask })
      .getOne();
  };

  // async saveTask(taskData: Task): Promise<Task> {
  //   const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   let currentStep = 'initial';

  //   try {
  //     emptyToNullRecursive(taskData);
  //     const employeeRepository = queryRunner.manager.getRepository(Employee);
  //     const taskTypeRepository = queryRunner.manager.getRepository(TaskType);
  //     const productionLineRepository = queryRunner.manager.getRepository(ProductionLine);
  //     const productRepository = queryRunner.manager.getRepository(Product);

  //     currentStep = 'get-employee';
  //     const employee = await employeeRepository.findOne({
  //       where: { idEmployee: taskData.employee.idEmployee },
  //     });
  //     taskData.employee = employee;

  //     if (taskData.taskType && taskData.taskType.idTaskType != null) {
  //       currentStep = 'get-task-type';
  //       const taskType = await taskTypeRepository.findOne({
  //         where: { idTaskType: taskData.taskType.idTaskType },
  //       });
  //       taskData.taskType = taskType;
  //     }

  //     if (taskData.productionLine && taskData.productionLine.idProductionLine != null) {
  //       currentStep = 'get-production-line';
  //       const productionLine = await productionLineRepository.findOne({
  //         where: { idProductionLine: taskData.productionLine.idProductionLine },
  //       });
  //       taskData.productionLine = productionLine;
  //     }

  //     if (taskData.product && taskData.product.idProduct != null) {
  //       currentStep = 'get-tooling';
  //       const tooling = await productRepository.findOne({
  //         where: { idProduct: taskData.product.idProduct },
  //       });
  //       taskData.product = tooling;
  //     }

  //     if (taskData.status == null) taskData.status = 0;
  //     taskData.startDate = taskData.startDate ? new Date(taskData.startDate) : null;
  //     taskData.finishDate = taskData.finishDate ? new Date(taskData.finishDate) : null;

  //     currentStep = 'set-status';
  //     if (taskData.status == TASK_NUMBER_STATUS.NOT_STARTED && taskData.startDate == null) {
  //       taskData.startDate = new Date();
  //       taskData.status = TASK_NUMBER_STATUS.UNDER_PROGRESS;
  //     } else if (
  //       taskData.status == TASK_NUMBER_STATUS.UNDER_PROGRESS &&
  //       taskData.finishDate == null
  //     ) {
  //       const tasks = await this.taskBaseRepository.getDataList({
  //         where: { employee: { idEmployee: taskData.employee.idEmployee } },
  //         order: { idTask: 'DESC' },
  //       });
  //       tasks.forEach(async task => {
  //         if (task.status == TASK_NUMBER_STATUS.UNDER_PROGRESS) {
  //           await this.taskBaseRepository.updateField(
  //             { idTask: task.idTask },
  //             { status: TASK_NUMBER_STATUS.PAUSED },
  //           );
  //         }
  //       });
  //     } else if (
  //       taskData.status == TASK_NUMBER_STATUS.UNDER_PROGRESS &&
  //       taskData.finishDate != null
  //     ) {
  //       taskData.finishDate = null;
  //     } else if (taskData.status == TASK_NUMBER_STATUS.PAUSED && taskData.finishDate != null) {
  //       taskData.finishDate = null;
  //     } else if (taskData.status == TASK_NUMBER_STATUS.FINISHED && taskData.finishDate == null) {
  //       taskData.finishDate = new Date();
  //     }

  //     if (taskData.usedSpareParts && taskData.usedSpareParts.length == 0)
  //       taskData.usedSpareParts = null;

  //     currentStep = 'create-task';
  //     const task = this.taskRepository.create({
  //       ...taskData,
  //     });

  //     currentStep = 'save-task';
  //     const savedTask = await queryRunner.manager.save(task);

  //     await queryRunner.commitTransaction();

  //     return savedTask;
  //   } catch (error) {
  //     const customError = error as CustomError;
  //     customError.step = currentStep;
  //     await queryRunner.rollbackTransaction();
  //     throw customError;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
}
