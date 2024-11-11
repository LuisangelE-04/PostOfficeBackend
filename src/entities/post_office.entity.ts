import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Packages, Address, Employees, EmployeeRecentLogin } from "./index";


@Entity('post_office')
export class PostOffice {
    @PrimaryGeneratedColumn({name: 'branch_id'})
    branchId!: number;

    @Column({name: 'branch_name', type: 'varchar', length:50})
    branchName!: string;

    @Column({name: 'email', type: 'varchar', length:50})
    email!: string;

    @Column({name: 'phone_Number', type: 'varchar', length:50})
    phoneNumber!: string;

    @Column({name: "post_office_address_id", type: "int", nullable: true})
    poAddress!: number;

    @OneToOne(() => Address)
    @JoinColumn({name: 'post_office_address_id'})
    address!: Address;

    @OneToMany(() => Employees, (employee) => employee.postOffice)
    employees: Employees[];

    @OneToMany(() => Packages, (packages) => packages.branch)
    packages: Packages[];

    @OneToMany(() => EmployeeRecentLogin, (recentLogins) => recentLogins.postOffice)
    recentLogins: EmployeeRecentLogin[];
}