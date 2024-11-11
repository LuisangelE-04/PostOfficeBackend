import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import logger from "../utils/logger";

export class AddDeletedAtColumnToCustomersTable1729924540077 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("customers", new TableColumn({
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
        }));
        logger.info(`Column Added to customers Table: deleted_at`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("customers", "deleted_at");
        logger.info(`Column dropped from customers Table: deleted_at`);
    }

}
