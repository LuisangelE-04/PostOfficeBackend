import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import {Address, Customers, PostOffice, TrackingHistory, Transaction} from './index'

@Entity('packages')
export class Packages {

    @PrimaryGeneratedColumn({name: 'package_id'})
    packageId!: number;

    @Column({ name: 'customer_id', type: 'int', nullable: false })
    customerId!: number;

    @ManyToOne(() => Customers, (customer) => customer.packages, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'customer_id'})
    customer!: Customers;

    @Column({ name: 'branch_id', type: 'int', nullable: false })
    branchId!: number;

    @ManyToOne(() => PostOffice, (post_office) => post_office.packages, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'branch_id'})
    branch!: PostOffice;

    @Column({name: 'sender_address_id', type: 'varchar', nullable: false})
    senderAddressId: number;

    @ManyToOne(() => Address, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'sender_address_id'})
    senderAddress: Address;

    @Column({name: 'recipient_address_id', type: 'varchar', nullable: false})
    recipientAddressId: number

    @ManyToOne(() => Address, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'recipient_address_id'})
    recipientAddress: Address;

    @Column({name: 'weight', type: 'decimal', precision: 10, scale: 2})
    weight: number;

    @Column({name: 'dimensions', type: 'varchar', length: 50, nullable: true})
    dimensions: string;

    @Column({name: 'amount', type: 'decimal', precision: 10, scale: 2, nullable: true})
    amount: number;

    @Column({name: 'shipping_method', type: 'varchar', length: 50})
    shippingMethod: string;

    @Column({name: 'status', type: 'varchar', length: 50, nullable: true})
    status: string;

    @Column({name: "shipping_date", type: 'date', nullable: true})
    shippingDate: Date;

    @Column({name: 'delivery_date', type: 'date', nullable: true})
    deliveryDate: Date;

    @Column({name: 'created_at', type: 'date', default: ()=> 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({name: 'updated_at', type: 'timestamp', default: ()=> 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
    
    @OneToMany(() => TrackingHistory, (trackingHistories) => trackingHistories.pkg)
    trackingHistories: TrackingHistory[];

    @OneToMany(() => Transaction, (transactions) => transactions.pkg)
    transactions: Transaction[];
}