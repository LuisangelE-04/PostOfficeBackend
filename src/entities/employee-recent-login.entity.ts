import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Employees, PostOffice } from "./index";


@Entity('employee_recent_logins')
export class EmployeeRecentLogin {
    @PrimaryGeneratedColumn({name: 'activity_id'})
    activityId: number;

    @Column({name: 'employee_id', type: "int", nullable: false})
    employeeId: number;

    @ManyToOne(() => Employees, (employee) => employee.recentLogins, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'employee_id'})
    employee!: Employees;

    @Column({name: 'login_time', type: 'timestamp', nullable: false})
    loginTime!: Date;

    @Column({name: 'branch_id', type: 'int', nullable: false})
    branchId: number;

    @ManyToOne(() => PostOffice, (postOffice) => postOffice.recentLogins, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'branch_id'})
    postOffice!: PostOffice;

}