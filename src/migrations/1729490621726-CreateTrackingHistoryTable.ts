import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import logger from "../utils/logger";


export class CreateTrackingHistoryTable1729490621726 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tracking_history",
                columns: [
                    {
                        name: "tracking_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "package_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "update_date",
                        type: "timestamp",
                        isNullable: false,
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "location",
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
                ],
            }),
            true
        );

        logger.info(`Table created: tracking_history`);

        await queryRunner.createForeignKey(
            "tracking_history",
            new TableForeignKey({
                columnNames: ["package_id"],
                referencedTableName: "packages",
                referencedColumnNames: ["package_id"],
                onDelete: "CASCADE",
                name: "FK_tracking_history_package_id",
            })
        );

        logger.info(`Foreign key created: FK_tracking_history_package_id`);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("tracking_history", "FK_tracking_history_package_id");
        logger.info(`Foreign key dropped: FK_tracking_history_package_id`);

        await queryRunner.dropTable("tracking_history");
        logger.info(`Table dropped: tracking_history`);
    }

}
