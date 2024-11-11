import { AppDataSource } from "../../data-source";
import { Employees } from "../../entities/employees.entity";
import { hash, compare } from 'bcrypt';
import { CreateEmployeeDTO, EmployeeLoginDTO } from "../../dtos";
import { PostOffice } from "../../entities/post_office.entity";
import { Employees as Manager } from "../../entities/employees.entity";
import { sign } from 'jsonwebtoken';
import { ConflictError, BadRequestError, NotFoundError, UnAuthorizedError } from '../../types/http-error.type'
import { CatchAsyncDecorator } from '../../decorators'
import { Repository } from 'typeorm';
import { EmployeeInfo } from "../../types/custom-request.type";





@CatchAsyncDecorator(EmployeesAuthService.name)
class EmployeesAuthService {

private postOfficeRepository: Repository<PostOffice>;
private employeeRepository: Repository<Employees>;

constructor() {
    this.postOfficeRepository = AppDataSource.getRepository(PostOffice);
    this.employeeRepository = AppDataSource.getRepository(Employees);

    this.employeeRegister = this.employeeRegister.bind(this);
    this.employeeLogin = this.employeeLogin.bind(this);
}

     async employeeRegister(dto: CreateEmployeeDTO) {
            const existingEmployee = await this.employeeRepository.findOne({where: {email: dto.email}});
            if(existingEmployee){
                throw new ConflictError('Employee with this email already exists');
            }
    
            const postOffice = await this.postOfficeRepository.findOne({where: {branchId: dto.branchId }});
            if(!postOffice){
                throw new NotFoundError('Post Office not found');
            }
    
            let manager: Manager |  null = null;
            if(dto.managerId) {
                manager = await this.employeeRepository.findOne({ where: { employeeId: dto.managerId}});
                if(!manager) {
                    throw new  NotFoundError('Manager Not Found');
                }
            }
    
            const hashPassword = await hash(dto.password, 10);
            const newEmployee = await this.employeeRepository.create({
                ...dto,
                password: hashPassword,
            });
            await this.employeeRepository.save(newEmployee);
    
            return newEmployee;
    }

    async employeeLogin(dto: EmployeeLoginDTO) {
            const JWT_SECRET = process.env.JWT_SECRET || '';
            const {email, password} = dto;
            const existedEmployee = await this.employeeRepository.findOne({where: { email }});
            if(!existedEmployee) {
                throw new NotFoundError('Employee is not existed');
            }
            const passwordCheck = await compare(password, existedEmployee.password)
            if(!passwordCheck) {
                throw new BadRequestError('Wrong password');
            }
            

            existedEmployee.lastLogin = new Date();
            await this.employeeRepository.save(existedEmployee);
            const employeeInfo: EmployeeInfo = {
                employeeId: existedEmployee.employeeId,
                firstName: existedEmployee.firstName, 
                lastName: existedEmployee.lastName,
                email: existedEmployee.email,
                position: existedEmployee.position,
                branchId: existedEmployee.branchId
            }
            const accessToken = sign(employeeInfo, JWT_SECRET, {expiresIn: '2h'});
            return accessToken;
}


}


const employeesAuthService = new EmployeesAuthService();

export {employeesAuthService}