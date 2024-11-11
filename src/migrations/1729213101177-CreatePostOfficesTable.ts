import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import logger from '../utils/logger';


export class CreatePostOfficeTable1729213101177 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "post_office",
                columns: [
                    {
                        name: "branch_id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "branch_name",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        name: "phone_number",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "post_office_address_id",
                        type: "int",
                        isNullable: false
                    },
                ],
            }),
            true
        );

        logger.info(`Table created: post_office`);

        await queryRunner.createForeignKey(
            "post_office",
            new TableForeignKey({
                columnNames: ["post_office_address_id"],
                referencedTableName: "address",
                referencedColumnNames: ["address_id"],
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
                name: "FK_post_office_address_id",
            })
        );

        logger.info(`Foreign key created: FK_post_office_address_id`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("post_office", "FK_post_office_address_id");
        logger.info(`Foreign key dropped: FK_post_office_address_id`);
        await queryRunner.dropTable("post_office");
        logger.info(`Table dropped: post_office`);
    }

}
