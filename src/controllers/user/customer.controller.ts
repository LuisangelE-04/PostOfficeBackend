import {Response} from 'express';
import {customersService, trackingHistoryService} from '../../services'
import {RequestWithCustomerInfo, CustomerInfo} from '../../types/custom-request.type'


class CustomerController {
    async getCustomerProfile (req: RequestWithCustomerInfo, res: Response) {
        const { customerId } = req.customerInfo as CustomerInfo;
        const existedCustomer = await customersService.getCustomerProfile(customerId);
        res.send(existedCustomer);
    }

    async editCustomerProfile (req: RequestWithCustomerInfo, res: Response) {
        const { customerId } = req.customerInfo as CustomerInfo;
        const updatedCustomer = await customersService.editCustomerProfile(customerId, req.body);
        res.send(updatedCustomer);
    }

    async getTrackingHistory (req: RequestWithCustomerInfo, res: Response) {
        const { customerId } = req.customerInfo as CustomerInfo;
        const trackinghistoryWithPackageInfo = await trackingHistoryService.viewTrackingHistoryWithCustomerId(customerId);
        res.send(trackinghistoryWithPackageInfo)
    }
}

const customerController = new CustomerController();
export {customerController}