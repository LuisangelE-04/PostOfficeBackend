import { MigrationInterface, QueryRunner, Table } from "typeorm";
import logger from "../utils/logger";

export class CreateSupplyTable1729498083836 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "supply",
                columns: [
                    {
                        name: "supply_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "supply_name",
                        type: "varchar",
                        length: "100",
                        isNullable: false,
                    },
                    {
                        name: "price",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: "quantity_in_stock",
                        type: "int",
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
                ],
            }),
            true
        );
        logger.info(`Table created: supply`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("supply");
        logger.info(`Table dropped: supply`);
    }

}
