import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from "typeorm";
import { Customers } from "./customer.entity";
import { PostOffice } from "./post_office.entity";

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn({name: 'address_ID'})
    addressId!: number;

    @Column({name: 'street', type: 'varchar', length:100})
    street!: string;

    @Column({name: 'city', type: 'varchar', length:50})
    city!: string;

    @Column({name: 'state', type: 'varchar', length:50})
    state!: string;

    @Column({name: 'zipcode', type: 'varchar', length:10})
    zipCode!: string;

    @OneToMany(() => Customers, (customer) => customer.address)
    customers!: Customers[];


}