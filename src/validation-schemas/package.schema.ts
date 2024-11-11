import Joi, {object} from "joi";
import  { createPackageDTO } from '../dtos'

interface CreatePackagePayload {
    payload: createPackageDTO;
}

const packageCreateValidator = Joi.object<CreatePackagePayload>().keys({
    payload: Joi.object<createPackageDTO>()
    .keys({
        customerFirstName: Joi.string().max(50).required(),
        customerLastName: Joi.string().max(50).required(),
        customerStreet: Joi.string().max(100).required(),
        customerCity: Joi.string().max(100).required(),
        customerState: Joi.string().max(10).required(),
        customerZipcode: Joi.string().max(10).required(),
        recipientStreet: Joi.string().max(100).required(),
        recipientCity: Joi.string().max(100).required(),
        recipientState: Joi.string().max(10).required(),
        recipientZipcode: Joi.string().max(10).required(),
        weight: Joi.number().precision(10).required(),
        dimensions: Joi.string().max(50).required(),
        amount: Joi.number().precision(10).required(),
        shippingMethod: Joi.string().max(50).required(),
        status: Joi.string().max(50).optional(),
        shippingDate: Joi.date().optional(),
        deliveryDate: Joi.date().optional(),
    })
    .required(),
});

export {packageCreateValidator}