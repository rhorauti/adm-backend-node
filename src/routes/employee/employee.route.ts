import { EmployeeController } from '@controllers/employee/employee.controller';
import Router from 'express';
import { container } from 'tsyringe';

const employeeRoute = Router();

const employeeController = container.resolve(EmployeeController);

employeeRoute.get('/employee', (request, response, next) => {
  employeeController.getEmployeeList(request, response, next);
});

employeeRoute.post('/employee', (request, response, next) => {
  employeeController.saveEmployee(request, response, next);
});

employeeRoute.post('/employee/delete', (request, response, next) => {
  employeeController.deleteEmployee(request, response, next);
});

export { employeeRoute };
