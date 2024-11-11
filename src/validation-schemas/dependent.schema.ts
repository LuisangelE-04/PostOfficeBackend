import Joi, {object} from "joi";
import  { CreateDependentDto} from '../dtos'

interface CreateDependentPayload {
    payload: CreateDependentDto;
}


const dependentCreateValidator = Joi.object<CreateDependentPayload>().keys({
    payload: Joi.object<CreateDependentDto>()
    .keys({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        relationship: Joi.string().max(50).required(),
        DOB: Joi.date().required(),
        sex: Joi.string().max(1).required()
    })
    .required(),
});


export {dependentCreateValidator}