import { AppDataSource } from "../../data-source";
import { Customers, Address } from '../../entities';
import { hash, compare } from 'bcrypt';
import { CreateCustomerDTO, CustomerLoginDTO } from "../../dtos";
import { sign } from 'jsonwebtoken';
import { ConflictError, BadRequestError, NotFoundError, UnAuthorizedError } from '../../types/http-error.type'
import { Repository } from 'typeorm';
import { CustomerInfo } from "../../types/custom-request.type";





class CustomerAuthService {

private addressRepository: Repository<Address>;
private customerRepository: Repository<Customers>;

constructor() {
    this.addressRepository = AppDataSource.getRepository(Address);
    this.customerRepository = AppDataSource.getRepository(Customers);

    this.customerRegister = this.customerRegister.bind(this);
    this.customerLogin = this.customerLogin.bind(this);
}

    private async checkExistingAddress(dto: CreateCustomerDTO) {
        return await this.addressRepository.findOne({
            where: {
                street: dto.street,
                city: dto.city,
                state: dto.state,
                zipCode: dto.zipcode
            }
        });
    }

    private async checkExistingCustomer(email: string) {
        return await this.customerRepository.findOne({where: {email} });
    }

    private async createCustomerWithExistingAddress(dto: CreateCustomerDTO, addressId: number, password: string){
        const newCustomer = await this.customerRepository.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            addressID: addressId,
            password: password
        });
        return await this.customerRepository.save(newCustomer);
    }

    private async createNewAddress(dto: CreateCustomerDTO) {
        const newAddress = await this.addressRepository.create({
            street: dto.street,
            city: dto.city,
            state: dto.state,
            zipCode: dto.zipcode
        });
        return await this.addressRepository.save(newAddress);
    }
    
    private async createCustomerWithNewAddress(dto: CreateCustomerDTO, addressId: number, password: string) {
        const newCustomer = await this.customerRepository.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            addressID: addressId,
            password: password,
        });
        return await this.customerRepository.save(newCustomer);
    }

    async customerRegister(dto: CreateCustomerDTO) {
            const existingCustomer = await this.checkExistingCustomer(dto.email)
            const existingAddress = await this.checkExistingAddress(dto);
            if(existingCustomer && existingCustomer.deletedAt !== null) {
                if (existingCustomer.addressID === existingAddress?.addressId) {
                    existingCustomer.deletedAt = null;
                    await this.customerRepository.save(existingCustomer);
                    return existingCustomer;
                }

                if (existingAddress) {
                    existingCustomer.deletedAt = null;
                    existingCustomer.addressID = existingAddress.addressId;
                    await this.customerRepository.save(existingCustomer);
                    return existingCustomer;
                }
                
                const newAddress = await this.createNewAddress(dto);
                existingCustomer.deletedAt = null;
                existingCustomer.addressID = newAddress.addressId;
                await this.customerRepository.save(existingCustomer);
                return existingCustomer;
            }

            if (existingAddress && existingCustomer) {
                throw new ConflictError('Customer with this email and address already exists');
            }

            const hashPassword = await hash(dto.password, 10);
            if(existingAddress && !existingCustomer){
                return this.createCustomerWithExistingAddress(dto, existingAddress.addressId, hashPassword);
            } else if (!existingAddress && !existingCustomer) {
                const newAddress = await this.createNewAddress(dto);
                return this.createCustomerWithNewAddress(dto, newAddress.addressId, hashPassword);
            }
    
    }

    async customerLogin(dto: CustomerLoginDTO) {
        const JWT_SECRET = process.env.JWT_SECRET || '';
        const {email, password} = dto;
        const existingCustomer = await this.customerRepository.findOne({where: {email}});
        if(!existingCustomer || existingCustomer.deletedAt !== null) {
            throw new NotFoundError('Customer is not existed')
        }
        const passwordCheck = await compare(password, existingCustomer.password)

        if(!passwordCheck) {
            throw new BadRequestError('Wrong password');
        }
        
        const customerInfo : CustomerInfo = {
            customerId: existingCustomer.customerId,
            addressId: existingCustomer.addressID
        }

        const accessToken = sign(customerInfo, JWT_SECRET, {expiresIn: '2h'});
        return accessToken

    }

    async customerSoftDelete (customerId: number) {
        const existingCustomer = await this.customerRepository.findOne({where: {customerId}})
        if(!existingCustomer) {
            throw new NotFoundError('The customer does not exist')
        }

        existingCustomer.deletedAt = new Date();
        await this.customerRepository.save(existingCustomer);
        return {message: 'Your account is successfully deleted'}
    }
}

const customerAuthService = new CustomerAuthService();

export {customerAuthService}