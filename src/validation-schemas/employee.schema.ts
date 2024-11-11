import Joi, {object} from "joi";
import  { CreateEmployeeDTO, EmployeeLoginDTO } from '../dtos'

interface CreateEmployeePayload {
    payload: CreateEmployeeDTO;
}

interface employeeLoginPayload {
    payload: EmployeeLoginDTO
};

const employeeCreateValidator = Joi.object<CreateEmployeePayload>().keys({
    payload: Joi.object<CreateEmployeeDTO>()
    .keys({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        DOB: Joi.date().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().min(10).max(10).required(),
        position: Joi.string().min(1).max(50).required(),
        password: Joi.string().min(8).required(),
        branchId: Joi.number().required(),
        managerId: Joi.number().allow(null).optional(),


    })
    .required(),
});

const employeeLoginValidator = Joi.object<employeeLoginPayload>().keys({
    payload: Joi.object<EmployeeLoginDTO>()
    .keys({
        email : Joi.string().min(2).max(50).required(),
        password: Joi.string().min(8).max(50).required(),
    })
    .required(),
});

export {employeeCreateValidator, employeeLoginValidator}