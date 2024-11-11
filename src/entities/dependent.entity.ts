import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Collection, JoinColumn } from "typeorm";
import { Employees } from "./employees.entity";

@Entity('dependent')
export class Dependent {
    @PrimaryGeneratedColumn({name: 'dependent_id'})
    dependentID!: number;

    @Column({name: 'first_name', type: 'varchar', length:50})
    firstName!: string;

    @Column({name: 'last_Name', type: 'varchar', length:50})
    lastName!: string;

    @Column({name: 'relationship', type: 'varchar', length:50})
    relationship: string;

    @Column({name: 'date_of_birth', type: 'date'})
    DOB!: Date;

    @Column({name: 'sex', type: 'char' ,length: 1 })
    sex: string;

    @Column({name: "employee_id", type: 'varchar'})
    employeeId: number;

    @ManyToOne(() => Employees, (employee) => employee.dependents)
    @JoinColumn({name: 'employee_id'})
    employee!: Employees;
}