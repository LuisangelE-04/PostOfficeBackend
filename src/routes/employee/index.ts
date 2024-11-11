import { Router } from "express";
import { employeeController, dataReportController} from '../../controllers'
import { asyncHandler, validateBody } from "../../middlewares";
import {employeeAuthenticationMiddleware, managerAuthenticationMiddleware} from '../../middlewares'
import { packageCreateValidator } from "../../validation-schemas";


const employeeRouter = Router();

employeeRouter.get('/profile', asyncHandler(employeeAuthenticationMiddleware), asyncHandler(employeeController.getEmployeeProfile));
employeeRouter.put('/edit-profile', asyncHandler(employeeAuthenticationMiddleware), asyncHandler(employeeController.editEmployeeProfile));
employeeRouter.post('/create-new-package',validateBody(packageCreateValidator), asyncHandler(employeeAuthenticationMiddleware), asyncHandler(employeeController.createPackage));
employeeRouter.put('/update-package', asyncHandler(employeeAuthenticationMiddleware), asyncHandler(employeeController.updatePackage));
employeeRouter.get('/package-and-tracking-report', asyncHandler(managerAuthenticationMiddleware), asyncHandler(dataReportController.getPackageInfoAndTrackingHistoryByBranchId));
employeeRouter.get('/employees-and-logins-report', asyncHandler(managerAuthenticationMiddleware), asyncHandler(dataReportController.getEmployeeInfoAndRecentLoginsByBranchId));
employeeRouter.post('/add-dependent', asyncHandler(employeeAuthenticationMiddleware), asyncHandler(employeeController.addDependent));
employeeRouter.get('/employee-and-dependents-report', asyncHandler(managerAuthenticationMiddleware), asyncHandler(dataReportController.getEmployeeInfoAndDependentsByBranchId))


export default employeeRouter;
