import { In, Repository } from 'typeorm'
import {CreateTrackingHistoryDTO} from '../../dtos'
import { PostOffice, TrackingHistory, Address, Customers, Packages } from '../../entities'
import { AppDataSource } from '../../data-source'
import { NotFoundError } from '../../types/http-error.type'
import { date } from 'joi'



class TrackingHistoryService {
    private trackingHistoryRepository: Repository<TrackingHistory>
    private postOfficeRepository: Repository<PostOffice>;
    private customerRepository: Repository<Customers>;
    private packageRepository: Repository<Packages>
    

    constructor() {
        this.trackingHistoryRepository = AppDataSource.getRepository(TrackingHistory);
        this.postOfficeRepository = AppDataSource.getRepository(PostOffice);
        this.customerRepository = AppDataSource.getRepository(Customers);
        this.packageRepository = AppDataSource.getRepository(Packages);

        this.createTrackingHistory = this.createTrackingHistory.bind(this)
        this.viewTrackingHistoryWithCustomerId = this.viewTrackingHistoryWithCustomerId.bind(this)
    }

    async createTrackingHistory (branchId: number, dto: CreateTrackingHistoryDTO) {

        const location = await this.postOfficeRepository.findOne({where: {branchId}, relations: ['address']})
        if(!location) {
            throw new NotFoundError("Post Office is not found")
        }
        const newTrackingHistory = await this.trackingHistoryRepository.create({
            packageId: dto.packageId,
            status: dto.status,
            location: location.address.city + ', ' + location.address.state,
        });

        await this.trackingHistoryRepository.save(newTrackingHistory);
        return newTrackingHistory;
    }

    async viewTrackingHistoryWithCustomerId (customerId: number) {
        const existingCustomer = await this.customerRepository.findOne({where: {customerId}});
        if (!existingCustomer) {
            throw new NotFoundError("Customer is not existed")
        }

        const packages  = await this.packageRepository.find({where: {customerId}, relations: ['senderAddress', 'recipientAddress', 'trackingHistories']});
        if (!packages ) {
            throw new NotFoundError("You don't have any package infile")
        }

        return packages.map(pkg => ({
            packageInfo: {
                packageId: pkg.packageId,
                weight: pkg.weight,
                dimensions: pkg.dimensions,
                amount: pkg.amount,
                shippingMethod: pkg.shippingMethod,
                shippingDate: pkg.shippingDate,
                deliveryDate: pkg.deliveryDate,
                createAt: pkg.createdAt,
                updatedAt: pkg.updatedAt,
            },
            senderAddress: {
                street: pkg.senderAddress.street,
                city: pkg.senderAddress.city,
                state: pkg.senderAddress.state,
                zipcode: pkg.senderAddress.zipCode,
            },
            recepientAddress: {
                street: pkg.recipientAddress.street,
                city: pkg.recipientAddress.city,
                state: pkg.recipientAddress.state,
                zipcode: pkg.recipientAddress.zipCode,
            },
            trackingHistory: pkg.trackingHistories.map(history => ({
                status: history.status,
                date: history.updateDate,
                location: history.location,
            }))
        }))


    }



}

const trackingHistoryService = new TrackingHistoryService();

export { trackingHistoryService }