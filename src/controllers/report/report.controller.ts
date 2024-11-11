import {Request, Response} from 'express';
import {RequestWithEmployeeInfo, EmployeeInfo} from '../../types/custom-request.type'
import {dataReportService} from '../../services'



class DataReportController {
    async getPackageInfoAndTrackingHistoryByBranchId (req: RequestWithEmployeeInfo, res: Response){
        const { branchId } = req.employeeInfo as EmployeeInfo;
        const {startDate, endDate} = req.body || undefined;
        const packageAndTrackingHistoriesReport = await dataReportService.getPackageInfoAndTrackingHistoriesByBranchId(branchId, startDate, endDate);
        res.send(packageAndTrackingHistoriesReport)
    }

    async getEmployeeInfoAndRecentLoginsByBranchId (req: RequestWithEmployeeInfo, res: Response) {
        const { branchId } = req.employeeInfo as EmployeeInfo;
        const employeeInfoAndRecentLoginsReport = await dataReportService.getEmployeeInfoAndEmployeeRecentLoginByBranchId(branchId);
        res.send(employeeInfoAndRecentLoginsReport)
    }

    async getEmployeeInfoAndDependentsByBranchId (req: RequestWithEmployeeInfo, res: Response) {
        const { branchId } = req.employeeInfo as EmployeeInfo;
        const {startDate, endDate} = req.body || undefined;
        const employeeAndDependentsReport = await dataReportService.getEmployeesInfoAndDependentsInfoByBranchId(branchId, startDate, endDate);
        res.send(employeeAndDependentsReport);
    }

}

const dataReportController = new DataReportController();

export {dataReportController}