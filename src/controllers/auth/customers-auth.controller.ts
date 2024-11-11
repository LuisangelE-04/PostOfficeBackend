import { Request, Response } from "express";
import { customerAuthService } from "../../services";
import { CustomerInfo, RequestWithCustomerInfo } from "../../types/custom-request.type";

class CustomersAuthController {
    async customerRegister(req: Request, res: Response) {
        const { payload } = req.body;
        const newCustomer = await customerAuthService.customerRegister(payload);
        res.status(201).send({newCustomer});
    }

    async customerLogin(req: Request, res: Response){
        const { payload } = req.body;
        const accessToken = await customerAuthService.customerLogin(payload);
        res.status(200).send(accessToken);
    }

    async customerSoftDelete (req: RequestWithCustomerInfo, res: Response) {
        const {customerId} = req.customerInfo as CustomerInfo;
        const deletedUser = await customerAuthService.customerSoftDelete(customerId);
        res.send(deletedUser);
    }
}

const customerAuthController = new CustomersAuthController();

export {customerAuthController}