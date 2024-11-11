import { Request, Response } from "express";
import { employeesAuthService } from "../../services";
import { CatchAsyncDecorator } from '../../decorators'



@CatchAsyncDecorator(EmployeesAuthController.name)
class EmployeesAuthController {
    async employeeRegister(req: Request, res: Response) {
        const { payload } = req.body;
        const newEmployee = await employeesAuthService.employeeRegister(payload);
        res.status(201).send({newEmployee});
    }

    async employeeLogin(req: Request, res: Response){
        const { payload } = req.body;
        const accessToken = await employeesAuthService.employeeLogin(payload);
        res.status(200).send(accessToken);
    }

}

const employeesauthController = new EmployeesAuthController();

export {employeesauthController}