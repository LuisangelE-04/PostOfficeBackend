import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Transaction, Dependent, PostOffice, EmployeeRecentLogin } from "./index";


@Entity('employees')
export class Employees {
    @PrimaryGeneratedColumn({name: 'employee_id'})
    employeeId!: number;

    @Column({name: 'first_name', type: 'varchar', length:50})
    firstName!: string;

    @Column({name: 'last_name', type: 'varchar', length:50})
    lastName!: string;

    @Column({name: 'dob', type: 'date'})
    DOB!: Date;

    @Column({name: 'email', type: 'varchar', length:50})
    email!: string;

    @Column({name: 'phone_number', type: 'varchar', length:10})
    phoneNumber!: string;

    @Column({name: 'position', type: 'varchar', length:50})
    position!: string;

    @Column({ name: 'branch_id', type: 'int', nullable: true })
    branchId!: number;

    @Column({name: "manager_id", type: "int", nullable: true})
    managerId!: number;

    @Column({ name: 'password', type: 'varchar', length: 255 })
    password!: string;

    @Column({name: "last_login", type: "timestamp", nullable: true})
    lastLogin: Date;

    @ManyToOne(() => PostOffice, (postOffice) => postOffice.employees)
    @JoinColumn({name: 'branch_id'})
    postOffice!: PostOffice;


    @ManyToOne(() => Employees)
    @JoinColumn({name: 'manager_id'})
    managerID?: Employees | null;

    @OneToMany(() => Dependent, (dependents) => dependents.employee)
    dependents?: Dependent[] | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @OneToMany(() =>  Transaction, (transactions) => transactions.employee)
    transactions: Transaction[]

    @OneToMany(() => EmployeeRecentLogin, (recentLogins) => recentLogins.employee)
    recentLogins: EmployeeRecentLogin[];


}