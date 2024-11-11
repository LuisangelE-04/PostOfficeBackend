import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import logger from "../utils/logger";

export class CreateSaleTable1729498877355 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "sales",
                columns: [
                    {
                        name: "sale_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "supply_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "customer_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "employee_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "sale_date",
                        type: "timestamp",
                        isNullable: false,
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "quantity",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "total_amount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                ],
            }),
            true
        );

        logger.info(`Table created: sale`);


        // Foreign Key for supply_id
        await queryRunner.createForeignKey(
            "sales",
            new TableForeignKey({
                columnNames: ["supply_id"],
                referencedTableName: "supply",
                referencedColumnNames: ["supply_id"],
                onDelete: "CASCADE",
                name: "FK_supply_id",
            })
        );
        logger.info(`Foreign key created: FK_supply_id`);

        // Foreign Key for customer_id
        await queryRunner.createForeignKey(
            "sales",
            new TableForeignKey({
                columnNames: ["customer_id"],
                referencedTableName: "customers",
                referencedColumnNames: ["customer_id"],
                onDelete: "CASCADE",
                name: "FK_customer_id",
            })
        );
        logger.info(`Foreign key created: FK_customer_id`);

        // Foreign Key for employee_id
        await queryRunner.createForeignKey(
            "sales",
            new TableForeignKey({
                columnNames: ["employee_id"],
                referencedTableName: "employees",
                referencedColumnNames: ["employee_id"],
                onDelete: "RESTRICT",
                name: "FK_employee_id"
            })
        );
        logger.info(`Foreign key created: FK_employee_id`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("sales", "FK_sale_supply_id");
        logger.info(`Foreign key dropped: FK_sale_supply_id`);

        await queryRunner.dropForeignKey("sales", "FK_sale_customer_id");
        logger.info(`Foreign key dropped: FK_sale_customer_id`);

        await queryRunner.dropForeignKey("sales", "FK_sale_employee_id");
        logger.info(`Foreign key dropped: FK_sale_employee_id`);

        await queryRunner.dropTable("sales");
        logger.info(`Table dropped: sale`);
    }

}
