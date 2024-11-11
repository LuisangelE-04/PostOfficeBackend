import { Router } from "express";
import { customerController} from '../../controllers'
import { asyncHandler } from "../../middlewares";
import {customerAuthenticationMiddleware} from '../../middlewares'


const customerRouter = Router();

customerRouter.get('/profile', asyncHandler(customerAuthenticationMiddleware) , asyncHandler(customerController.getCustomerProfile));
customerRouter.put('/edit-profile', asyncHandler(customerAuthenticationMiddleware) , asyncHandler(customerController.editCustomerProfile))
customerRouter.get('/tracking-history', asyncHandler(customerAuthenticationMiddleware) , asyncHandler(customerController.getTrackingHistory));

export default customerRouter;
