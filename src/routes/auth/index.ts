import { Router } from "express";
import { customerAuthController, employeesauthController } from "../../controllers";
import { validateBody, asyncHandler, managerAuthenticationMiddleware, customerAuthenticationMiddleware } from "../../middlewares";
import { employeeCreateValidator, employeeLoginValidator, customerCreateValidator, customerLoginValidator } from "../../validation-schemas";

const authRouter = Router();

authRouter.post('/employee-register', asyncHandler(managerAuthenticationMiddleware), validateBody(employeeCreateValidator), asyncHandler(employeesauthController.employeeRegister));
authRouter.post('/employee-login', validateBody(employeeLoginValidator), asyncHandler(employeesauthController.employeeLogin));
authRouter.post('/customer-register', validateBody(customerCreateValidator), asyncHandler(customerAuthController.customerRegister));
authRouter.post('/customer-login', validateBody(customerLoginValidator), asyncHandler(customerAuthController.customerLogin));
authRouter.patch('/delete-customer-account', asyncHandler(customerAuthenticationMiddleware), asyncHandler(customerAuthController.customerSoftDelete));



export default authRouter;