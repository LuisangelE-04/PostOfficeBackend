import { Request, NextFunction, Response } from "express";
import { verify } from 'jsonwebtoken';
import { RequestWithEmployeeInfo, EmployeeInfo, RequestWithCustomerInfo, CustomerInfo} from '../types/custom-request.type'
import { BadRequestError, UnAuthorizedError, ForbiddenError } from "../types/http-error.type";
import * as dotenv from 'dotenv';
import { toString } from "lodash";

dotenv.config()




const employeeAuthenticationMiddleware = async (req : RequestWithEmployeeInfo, res: Response, next: NextFunction) => {

        const accessToken: string = req.headers['authentication'] as string;
        if(!accessToken) {
            return next(new UnAuthorizedError('Require access token'))
        }
        const secrectKey = toString(process.env.JWT_SECRET)
        const decoded = verify(accessToken, secrectKey)
        req.employeeInfo = decoded as EmployeeInfo;
        return next();
}

const customerAuthenticationMiddleware = async (req : RequestWithCustomerInfo, res: Response, next: NextFunction) => {

    const accessToken: string = req.headers['authentication'] as string;
    if(!accessToken) {
        return next(new UnAuthorizedError('Require access token'))
    }
    const secrectKey = toString(process.env.JWT_SECRET)
    const decoded = verify(accessToken, secrectKey)
    req.customerInfo = decoded as CustomerInfo;
    return next();
}

const managerAuthenticationMiddleware = async (req: RequestWithEmployeeInfo, res: Response, next: NextFunction) => {
    const accessToken: string = req.headers['authentication'] as string;
    if(!accessToken) {
        return next(new UnAuthorizedError('Require access token'))
    }
    const secrectKey = toString(process.env.JWT_SECRET)
    const decoded = verify(accessToken, secrectKey)
    req.employeeInfo = decoded as EmployeeInfo;
    if(!req.employeeInfo.position.includes("Manager")) {
        return next(new ForbiddenError('You must be a Manager to use this feature'))
    }
    return next();
}

export { employeeAuthenticationMiddleware, customerAuthenticationMiddleware, managerAuthenticationMiddleware }