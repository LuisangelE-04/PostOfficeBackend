import {Request} from 'express'


type EmployeeInfo = {
    employeeId : number, 
    firstName : string, 
    lastName : string, 
    email : string, 
    position: string, 
    branchId: number};

type CustomerInfo = {
    customerId : number,  
    addressId: number};




interface RequestWithEmployeeInfo extends Request {
    employeeInfo?: EmployeeInfo;
}

interface RequestWithCustomerInfo extends Request {
    customerInfo?: CustomerInfo;
}

export {RequestWithEmployeeInfo, EmployeeInfo, RequestWithCustomerInfo, CustomerInfo};