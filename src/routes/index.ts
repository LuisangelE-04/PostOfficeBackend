import { Router } from "express";
import authRouter from "./auth";
import employeeRouter from './employee'
import customerRouter from './customer'

const apiRouter = Router();

apiRouter.use('/auth', authRouter)
apiRouter.use('/employee', employeeRouter)
apiRouter.use('/customer', customerRouter)

export default apiRouter;