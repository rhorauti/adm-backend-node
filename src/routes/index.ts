import { Router } from 'express';
import { authRoute } from './auth/auth.route';
import { companyRoute } from './company/company.route';
import { addressRoute } from './address/address.route';
import { departmentRoute } from './department/department.route';
import { companyFakeRoute } from './company/company.fake.route';
import { employeePositionRoute } from './employee/employee-position.route';
import { employeeRoute } from './employee/employee.route';
import { taskTypeRoute } from './task/task-type.route';

const router = Router();
router.use(authRoute);
router.use(companyRoute);
router.use(companyFakeRoute);
router.use(addressRoute);
router.use(employeePositionRoute);
router.use(taskTypeRoute);
router.use(employeeRoute);
router.use(departmentRoute);

export { router };
