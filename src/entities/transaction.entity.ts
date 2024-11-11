import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Employees, Customers, Packages } from "./index";

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn({ name: 'transaction_id' })
    transactionId!: number;
    
    @Column({name: 'package_id', type: 'int', nullable: false})
    packageId!: number

    @ManyToOne(() => Packages, (pkg) => pkg.transactions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'package_id' })
    pkg!: Packages;

    @Column({name: 'customer_id', type: 'int', nullable: false})
    customerId!: number;

    @ManyToOne(() => Customers, (customer) => customer.transactions, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customer_id' })
    customer!: Customers;

    @Column({name: 'employee_id', type: 'varchar', nullable: false})
    employeeId: number;

    @ManyToOne(() => Employees, (employee) => employee.transactions, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'employee_id' })
    employee!: Employees;

    @Column({ name: 'transaction_type', type: 'varchar', length: 50, nullable: false })
    transactionType!: string;

    @CreateDateColumn({ name: 'transaction_date' })
    transactionDate!: Date;

    @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 0, nullable: false })
    amount!: number;
}
