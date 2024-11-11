import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import logger from '../utils/logger';


export class CreateCustomerTable1729299190058 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "customers",
                columns: [
                    {
                        name: "customer_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "first_name",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "last_name",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        name:"phone_number",
                        type: "varchar",
                        length: "15",
                        isNullable: false
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
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
                    {
                        name: "address_id",
                        type: "int",
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        logger.info(`Table created: customers`);

        await queryRunner.createForeignKey(
            "customers",
            new TableForeignKey({
                columnNames: ["address_id"],
                referencedTableName: "address",
                referencedColumnNames: ["address_id"],
                onDelete: "RESTRICT",
                name: "FK_address_id"
            })
        );

        logger.info(`Foreign key created: FK_address_id`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("customers", "FK_address_id");
        logger.info(`Foreign key dropped: FK_address_id`);

        await queryRunner.dropTable("customers");
        logger.info(`Table dropped: customers`);
    }

}
