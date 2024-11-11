import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import logger from "../utils/logger";

export class CreatePackageTable1729489541653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "packages",
                columns: [
                    {
                        name: "package_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "customer_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "branch_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "sender_address_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "recipient_address_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "weight",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "dimensions",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "amount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "shipping_method",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                    },
                    {
                        name: "shipping_date",
                        type: "DATE",
                        isNullable: true,
                    },
                    {
                        name: "delivery_date",
                        type: "DATE",
                        isNullable: true,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        isNullable: false,
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                        isNullable: false
                    },
                ],
            }),
            true
        );

        logger.info(`Table created: Packages`);
    
        // Foreign key to customer
        await queryRunner.createForeignKey(
            "packages",
            new TableForeignKey({
                columnNames: ["customer_id"],
                referencedTableName: "customers",
                referencedColumnNames: ["customer_id"],
                onDelete: "CASCADE",
                name: "FK_package_customer_id",
            })
        );

        logger.info(`Foreign key created: FK_package_customer_id`);
    
        // Foreign key to post_office (branch_id)
        await queryRunner.createForeignKey(
            "packages",
            new TableForeignKey({
                columnNames: ["branch_id"],
                referencedTableName: "post_office",
                referencedColumnNames: ["branch_id"],
                onDelete: "RESTRICT",
                name: "FK_package_branch_id",
                
            })
        );

        logger.info(`Foreign key created: FK_package_branch_id`);
    
        // Foreign key to sender address
        await queryRunner.createForeignKey(
            "packages",
            new TableForeignKey({
                columnNames: ["sender_address_id"],
                referencedTableName: "address",
                referencedColumnNames: ["address_id"],
                onDelete: "CASCADE",
                name: "FK_package_sender_address_id",
            })
        );

        logger.info(`Foreign key created: FK_package_sender_address_id`);
    
        // Foreign key to recipient address
        await queryRunner.createForeignKey(
            "packages",
            new TableForeignKey({
                columnNames: ["recipient_address_id"],
                referencedTableName: "address",
                referencedColumnNames: ["address_id"],
                onDelete: "CASCADE",
                name: "FK_package_recipient_address_id"
            })
        );

        logger.info(`Foreign key created: FK_package_recipient_address_id`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("packages", "FK_package_customer_id");
        logger.info(`Foreign key dropped: FK_package_customer_id`);

        await queryRunner.dropForeignKey("packages", "FK_package_branch_id");
        logger.info(`Foreign key dropped: FK_package_branch_id`);

        await queryRunner.dropForeignKey("packages", "FK_package_sender_address_id");
        logger.info(`Foreign key dropped: FK_package_sender_address_id`);

        await queryRunner.dropForeignKey("packages", "FK_package_recipient_address_id");
        logger.info(`Foreign key dropped: FK_package_recipient_address_id`);

        await queryRunner.dropTable("packages");
        logger.info(`Table dropped: packages`);
    }

}
