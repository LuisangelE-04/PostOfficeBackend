import Joi, {object} from "joi";
import  { CreateCustomerDTO, CustomerLoginDTO } from '../dtos'

interface CreateCustomerPayload {
    payload: CreateCustomerDTO;
}

interface CustomerLoginPayload {
    payload: CustomerLoginDTO
};

const customerCreateValidator = Joi.object<CreateCustomerPayload>().keys({
    payload: Joi.object<CreateCustomerDTO>()
    .keys({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(8).required(),
        street: Joi.string().max(100).required(),
        city: Joi.string().max(100).required(),
        state: Joi.string().max(10).required(),
        zipcode: Joi.string().max(10).required(),
    })
    .required(),
});

const customerLoginValidator = Joi.object<CustomerLoginPayload>().keys({
    payload: Joi.object<CustomerLoginDTO>()
    .keys({
        email : Joi.string().min(2).max(50).required(),
        password: Joi.string().min(8).max(50).required(),
    })
    .required(),
});

export {customerCreateValidator, customerLoginValidator}