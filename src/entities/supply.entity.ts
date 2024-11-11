import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
// import { PostOffice } from "./index.ts";


@Entity('supply')
export class Supply {
    @PrimaryGeneratedColumn({ name: 'supply_id' })
    supplyId!: number;

    @Column({ name: 'supply_name', type: 'varchar', length: 100, nullable: false })
    supplyName!: string;

    @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2, nullable: false })
    price!: number;

    @Column({ name: 'quantity_in_stock', type: 'int', nullable: false })
    quantityInStock!: number;

    // @ManyToOne(() => PostOffice, (postOffice) => postOffice.supplies, { nullable: false, onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'branch_id' })
    // postOffice!: PostOffice;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}


