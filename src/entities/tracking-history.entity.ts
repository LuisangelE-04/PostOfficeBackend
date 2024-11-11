import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Packages } from './index';

@Entity('tracking_history')
export class TrackingHistory {
    @PrimaryGeneratedColumn({name: 'tracking_id'})
    trackingId: number;

    @Column({name: 'package_id', type: "int", nullable: false})
    packageId: number;

    @ManyToOne(() => Packages, (pkg) => pkg.trackingHistories, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'package_id' })
    pkg: Packages;

    @Column({ name: 'status', type: 'varchar', length: 50})
    status: string;
  
    @Column({ name: 'update_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updateDate: Date;
  
    @Column({name: 'location',  type: 'varchar', length: 255, nullable: true})
    location: string;
}