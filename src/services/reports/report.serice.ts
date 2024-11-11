import { AppDataSource } from "../../data-source";
import { Employees, Address, Packages, TrackingHistory, PostOffice } from "../../entities";
import {NotFoundError, ForbiddenError } from '../../types/http-error.type'
import { Not, QueryRunner, Repository } from 'typeorm';
import { format } from 'date-fns'

class DataReportService {
    private addressRepository: Repository<Address>;
    private postOfficeRepository: Repository<PostOffice>;
    private employeeRepository: Repository<Employees>;
    private packageRepository: Repository<Packages>

    constructor() {
    this.addressRepository = AppDataSource.getRepository(Address);
    this.postOfficeRepository = AppDataSource.getRepository(PostOffice);
    this.employeeRepository = AppDataSource.getRepository(Employees);
    this.packageRepository = AppDataSource.getRepository(Packages);
    


}

private async executeQuery (query: string, parameters: any[]) : Promise<any[]> {
    const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        const result = await queryRunner.query(query, parameters);
        return result;
    } finally {
        await queryRunner.release();
    }
}

private async getPostOfficeByBranchId(branchId: number) {
    const query = `
        SELECT 
            po.branch_id, 
            po.branch_name,
            a.street, 
            a.city, 
            a.state, 
            a.zipcode
        FROM post_office po
        LEFT JOIN address a ON po.post_office_address_id = a.address_id
        WHERE po.branch_id = ?;
    `;
    const [postOffice] = await this.executeQuery(query, [branchId]);
    return postOffice || null; 
}

private async getPackagesByBranchId (branchId: number, startDate?: Date, endDate?: Date) {
    let query = `
        SELECT 
            p.package_id, 
            p.weight, 
            p.dimensions, 
            p.amount,
            p.shipping_method, 
            p.shipping_date, 
            p.delivery_date, 
            p.created_at, 
            p.updated_at,
            th.status, 
            th.update_date, 
            th.location
        FROM packages p
        LEFT JOIN tracking_history th ON p.package_id = th.package_id
        WHERE p.branch_id = ?
    `;

    const queryParams: (number | Date)[] = [branchId];

    if (startDate && endDate) {
        query += ` AND p.created_at BETWEEN ? AND ?`;
        queryParams.push(startDate, endDate);
    } else if (startDate && !endDate) {
        query += ` AND p.created_at >= ?`;
        queryParams.push(startDate);
    } else if (!startDate && endDate) {
        query += ` AND p.created_at <= ?`;
        queryParams.push(endDate);
    }

    query += ` ORDER BY p.package_id, th.update_date;`;

    return await this.executeQuery(query, queryParams);
}

private createPostOfficeInfo(postOffice: any) {
    return {
        branchId: postOffice.branch_id,
        branchName: postOffice.branch_name,
        address: postOffice.street ? {
            street: postOffice.street,
            city: postOffice.city,
            state: postOffice.state,
            zipcode: postOffice.zipcode,
        } : null,
    };
}

private createPackagesInfo(packages: any[]) {
    const packagesInfo: any[] = [];
    let currentPackageId = null;
    let currentPackage: any = null;

    for (const pkg of packages) {
        if (pkg.package_id !== currentPackageId) {
            if (currentPackage) {
                packagesInfo.push(currentPackage);
            }
            currentPackageId = pkg.package_id;
            currentPackage = {
                packageInfo: {
                    packageId: pkg.package_id,
                    weight: pkg.weight,
                    dimensions: pkg.dimensions,
                    amount: pkg.amount,
                    shippingMethod: pkg.shipping_method,
                    shippingDate: format(new Date(pkg.shipping_date), 'yyyy-MM-dd HH:mm:ss'),
                    deliveryDate: pkg.delivery_date ? format(new Date(pkg.delivery_date), 'yyyy-MM-dd HH:mm:ss') : null,
                    createdAt: format(new Date(pkg.created_at), 'yyyy-MM-dd HH:mm:ss'),
                    updatedAt: format(new Date(pkg.updated_at), 'yyyy-MM-dd HH:mm:ss'),
                },
                trackingHistory: [] as any[],
            };
        }
        if (currentPackage) {
            currentPackage.trackingHistory.push({
                status: pkg.status,
                date: format(new Date(pkg.update_date), 'yyyy-MM-dd HH:mm:ss'),
                location: pkg.location,
            });
        }
    }
    if (currentPackage) {
        packagesInfo.push(currentPackage);
    }

    return packagesInfo;
}

private constructResponse(postOffice: any, packages: any[]) {
    const postOfficeInfo = this.createPostOfficeInfo(postOffice);
    const packagesInfo = this.createPackagesInfo(packages);

    return {
        postOfficeInfo,
        packages: packagesInfo,
    };
}

async getPackageInfoAndTrackingHistoriesByBranchId(branchId: number, startDate?: Date, endDate?: Date) {
    const postOffice = await this.getPostOfficeByBranchId(branchId);
    if (!postOffice) {
        throw new NotFoundError("Post Office does not exist");
    }

    const packages = await this.getPackagesByBranchId(branchId, startDate, endDate);
    if (!packages || packages.length === 0) {
        throw new NotFoundError("No packages exist");
    }

    return this.constructResponse(postOffice, packages);
}





// async getPackageInfoAndTrackingHistoriesByBranchId (branchId: number) {
//     const postOffice = await this.postOfficeRepository.findOne({where: {branchId}, relations: ["address"]});
//     if (!postOffice) {
//         throw new NotFoundError("Post Office does not exist")
//     }

//     const packages = await this.packageRepository.find({where: {branchId}, relations: ["trackingHistories", "branch"]});
//     if (packages.length === 0) {
//         throw new NotFoundError("No packages exist")
//     }

//     return{ 
//         postOfficeInfo: {
//             branchId : postOffice.branchId,
//             branchName: postOffice.branchName,
//             address: postOffice.address ?{
//                 street: postOffice.address.street,
//                 city: postOffice.address.city,
//                 state: postOffice.address.state,
//                 zipcode: postOffice.address.zipCode,
//             } : null
//         },
//         packages: packages.map(pkg => ({
//         packageInfo: {
//             packageId: pkg.packageId,
//             weight: pkg.weight,
//             dimensions: pkg.dimensions,
//             amount: pkg.amount,
//             shippingMethod: pkg.shippingMethod,
//             shippingDate: pkg.shippingDate,
//             deliveryDate: pkg.deliveryDate,
//             createAt: pkg.createdAt,
//             updatedAt: pkg.updatedAt,
//         },
//         trackingHistory: pkg.trackingHistories.map(history => ({
//             status: history.status,
//             date: history.updateDate,
//             location: history.location,
//         }))
        
//     }))}
    
// }

async getEmployeeInfoAndEmployeeRecentLoginByBranchId (branchId: number) {
    const postOffice = await this.postOfficeRepository.findOne({
        where: {branchId},
        relations: ['address']
    });
    if(!postOffice) {
        throw new NotFoundError("This post office's branch does not exist")
    }

    const employees = await this.employeeRepository.find({
        where: {branchId},
       relations: ['recentLogins']
    })
    if(employees.length === 0){
        throw new NotFoundError('No employees found in this branch')
    }

    return {
        postOfficeInfo: {
            branchId : postOffice.branchId,
            branchName: postOffice.branchName,
            address: postOffice.address ?{
                street: postOffice.address.street,
                city: postOffice.address.city,
                state: postOffice.address.state,
                zipcode: postOffice.address.zipCode,
            } : null
        },
        employees: employees.map(employee => ({
            employeeInfo: {
                employeeId: employee.employeeId,
                firstName: employee.firstName,
                lastName: employee.lastName,
                phoneNumber: employee.phoneNumber,
                position: employee.position,
                createdAt: format(new Date(employee.createdAt), 'yyyy-MM-dd HH:mm:ss'),

            },
            recentLogins: employee.recentLogins.map(logins => ({
                ...logins,
                loginTime: format(new Date(logins.loginTime), 'yyyy-MM-dd HH:mm:ss')
            })) || null
        }))
    }


}

private async getEmployeesAndDependentByBranchId (branchId: number, startDate?: Date, endDate?: Date) {
    let query = `
    SELECT 
        e.employee_id,
        e.first_name AS employee_first_name,
        e.last_name AS employee_last_name,
        e.email,
        e.phone_number,
        e.position,
        e.created_at,
        d.dependent_id,
        d.first_name AS dependent_first_name,
        d.last_name AS dependent_last_name,
        d.relationship,
        d.date_of_birth,
        d.sex
    FROM employees e
    LEFT JOIN dependent d ON e.employee_id = d.employee_id
    WHERE e.branch_id = ?
    `;

    const queryParams: (number | Date)[] = [branchId];

    if (startDate && endDate) {
        query += ` AND e.created_at BETWEEN ? AND ?`;
        queryParams.push(startDate, endDate);
    } else if (startDate && !endDate) {
        query += ` AND e.created_at >= ?`;
        queryParams.push(startDate);
    } else if (!startDate && endDate) {
        query += ` AND e.created_at <= ?`;
        queryParams.push(endDate);
    }

    query += ` ORDER BY e.employee_id, d.date_of_birth`;

    return await this.executeQuery(query, queryParams);
}

async getEmployeesInfoAndDependentsInfoByBranchId (branchId: number, startDate?: Date, endDate?: Date) {
    const postOffice = await this.getPostOfficeByBranchId(branchId);
    if (!postOffice) {
        throw new NotFoundError("Post Office does not exist");
    }

    const employeesAndDependents = await this.getEmployeesAndDependentByBranchId(branchId, startDate, endDate);
    if (!employeesAndDependents || employeesAndDependents.length === 0) {
        throw new NotFoundError("No dependents found");
    }

    const response = [];
    let currentEmployeeId = null;
    let currentEmployee: any = {};

    for (const record of employeesAndDependents) {
        if (record.employee_id !== currentEmployeeId) {
            if (Object.keys(currentEmployee).length > 0) {
                response.push(currentEmployee);
            }
            currentEmployeeId = record.employee_id;
            currentEmployee = {
                employeeInfo: {
                    employeeId: record.employee_id,
                    firstName: record.employee_first_name,
                    lastName: record.employee_last_name,
                    email: record.email,
                    phoneNumber: record.phone_number,
                    position: record.position,
                    createdAt: format(new Date(record.created_at), 'yyyy-MM-dd HH:mm:ss'),
                },
                dependents: []
            };
        }
        if (record.dependent_id) {
            currentEmployee.dependents.push({
                dependentId: record.dependent_id,
                firstName: record.dependent_first_name,
                lastName: record.dependent_last_name,
                relationship: record.relationship,
                dateOfBirth: format(new Date(record.date_of_birth), 'yyyy-MM-dd'),
                sex: record.sex,
            });
        }
    }
    if (currentEmployee) {
        response.push(currentEmployee);
    }

    return response;
}




}

const dataReportService = new DataReportService();
export {dataReportService};