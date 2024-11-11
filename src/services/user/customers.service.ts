import { AppDataSource } from "../../data-source";
import {Customers, Address} from '../../entities'
import { NotFoundError } from '../../types/http-error.type'
import { UpdateCustomerDTO } from '../../dtos'
import { Repository } from 'typeorm';


class CustomersService {
    private addressRepository: Repository<Address>;
    private customerRepository: Repository<Customers>;

constructor() {
    this.addressRepository = AppDataSource.getRepository(Address);
    this.customerRepository = AppDataSource.getRepository(Customers);

    this.getCustomerProfile = this.getCustomerProfile.bind(this);
    this.editCustomerProfile = this.editCustomerProfile.bind(this);
}

async getCustomerProfile(customerId: number) {
    const existedCustomer = await this.customerRepository.findOne({where: {customerId}});
    if (!existedCustomer) {

        throw new NotFoundError("Customer is not existed")
    }

    const address = await this.addressRepository.findOne({where: {addressId: existedCustomer.addressID}})
    if(!address) {
        throw new NotFoundError("Customer is currently not having any address infile")
    }

    const {password, ...customerProfile} = existedCustomer;
    return {
        ...customerProfile,
        address,
    }
}

async editCustomerProfile(customerId: number, dto: UpdateCustomerDTO) {
    const existedCustomer = await this.customerRepository.findOne({where: {customerId}});
    if (!existedCustomer) {

        throw new NotFoundError("Customer is not existed")
    }

    const address = await this.addressRepository.findOne({where: {street: dto.street, city: dto.city, state: dto.state, zipCode: dto.zipcode}})
    if(address) {
        existedCustomer.firstName = dto.firstName,
        existedCustomer.lastName = dto.lastName,
        existedCustomer.phoneNumber = dto.phoneNumber,
        existedCustomer.addressID = address.addressId,
        await this.customerRepository.save(existedCustomer);
        const {password, ...updatedCustomer} = existedCustomer;
        return {
            ...updatedCustomer,
            address,
        }
    }

    const newAddress = await this.addressRepository.create({
        street: dto.street,
        city: dto.city,
        state: dto.state,
        zipCode: dto.zipcode,
    })

    const customerNewAddresss = await this.addressRepository.save(newAddress);
    existedCustomer.firstName = dto.firstName,
    existedCustomer.lastName = dto.lastName,
    existedCustomer.phoneNumber = dto.phoneNumber,
    existedCustomer.addressID = customerNewAddresss.addressId,
    await this.customerRepository.save(existedCustomer);
    const {password, ...updatedCustomer} = existedCustomer;
    return {
        ...updatedCustomer,
        customerNewAddresss,
    }
}
}


const customersService = new CustomersService();

export {customersService}